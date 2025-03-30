import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config'; 

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);
  private readonly showtimeServiceUrl: string;
  private readonly theaterServiceUrl: string;
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly httpService: HttpService, // Inject HttpService to make HTTP requests
    private configService: ConfigService,
  ) {
    this.showtimeServiceUrl = this.configService.get<string>('SHOWTIMES_SERVICE_URL') || 'http://showtime-service:3003';
    this.theaterServiceUrl = this.configService.get<string>('THEATERS_SERVICE_URL') || 'http://theater-service:3002';
  }

  async bookTicket(showtimeId: number, seatNumber: number, userId: string) {
    this.logger.log(`Attempting to book seat ${seatNumber} for showtime ${showtimeId} by user ${userId}`);

    // Make HTTP request to the Showtime service to verify if the showtime exists
    let showtime;
    try {
      const showtimeResponse = await firstValueFrom(
        this.httpService.get(`${this.showtimeServiceUrl}/showtimes/${showtimeId}`)
      );
      showtime = showtimeResponse.data;
      this.logger.log(`Showtime with ID ${showtimeId} found, showtime: ${JSON.stringify(showtime)}`);
    } catch (error) {
      this.logger.error(`Showtime with ID ${showtimeId} not found`);
      throw new NotFoundException(`Showtime with ID ${showtimeId} not found`);
    }

    // Make HTTP request to the Theater service to get the max_person value
    try {
      const theaterResponse = await firstValueFrom(
        this.httpService.get(`${this.theaterServiceUrl}/theaters/${showtime.theaterId}`)
      );
      showtime.theater = theaterResponse.data;
      this.logger.log(`Theater with ID ${showtime.theaterId} found, theater: ${JSON.stringify(showtime.theater)}`);
    } catch (error) {
      this.logger.error(`Theater with ID ${showtime.theaterId} not found`);
      throw new NotFoundException(`Theater with ID ${showtime.theaterIdd} not found`);
    }

    // Assuming showtime contains the max_person data
    if (seatNumber > showtime.theater.max_person || seatNumber < 1) {
      this.logger.error(`Invalid seat number ${seatNumber} for theater ${showtime.theaterId} (Max: ${showtime.theater.max_person})`);
      throw new BadRequestException(`Seat number ${seatNumber} exceeds theater capacity (Max: ${showtime.theater.max_person})`);
    }

    // Check for existing booking
    const existingBooking = await this.bookingRepository.findOne({
      where: { showtimeId, seatNumber },
    });

    if (existingBooking) {
      this.logger.error(`Seat ${seatNumber} is already booked for showtime ${showtimeId}`);
      throw new ConflictException(`Seat ${seatNumber} is already booked for this showtime`);
    }

    // Create new booking
    const newBooking = this.bookingRepository.create({ showtimeId, seatNumber, userId });
    await this.bookingRepository.save(newBooking);

    this.logger.log(`Booking successful: ${JSON.stringify(newBooking)}`);
    return { bookingId: newBooking.id };
  }
}