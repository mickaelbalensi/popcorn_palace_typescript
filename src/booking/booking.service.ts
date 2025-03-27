import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { Theater } from '../theaters/entities/theater.entity';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    @InjectRepository(Theater)
    private readonly theaterRepository: Repository<Theater>,
  ) {}

  async bookTicket(showtimeId: number, seatNumber: number, userId: string) {
    this.logger.log(`Attempting to book seat ${seatNumber} for showtime ${showtimeId} by user ${userId}`);

    // Fetch the showtime with its theater details
    const showtime = await this.showtimeRepository.findOne({
      where: { id: showtimeId },
      relations: ['theater'], // Ensure we load the theater details
    });

    if (!showtime) {
      this.logger.error(`Showtime not found: ${showtimeId}`);
      throw new NotFoundException(`Showtime with ID ${showtimeId} not found`);
    }

    // Check if the seat number is within the theater's max capacity
    if (seatNumber > showtime.theater.max_person || seatNumber < 1) {
      this.logger.error(`Invalid seat number ${seatNumber} for theater ${showtime.theater.id} (Max: ${showtime.theater.max_person})`);
      throw new BadRequestException(`Seat number ${seatNumber} exceeds theater capacity (Max: ${showtime.theater.max_person})`);
    }

    // Check if the seat is already booked
    const existingBooking = await this.bookingRepository.findOne({
      where: { showtime: { id: showtimeId }, seatNumber },
    });

    if (existingBooking) {
      this.logger.error(`Seat ${seatNumber} is already booked for showtime ${showtimeId}`);
      throw new ConflictException(`Seat ${seatNumber} is already booked for this showtime`);
    }

    // Create and save the new booking
    const newBooking = this.bookingRepository.create({ showtime, seatNumber, userId });
    await this.bookingRepository.save(newBooking);

    this.logger.log(`Booking successful: ${JSON.stringify(newBooking)}`);
    return { bookingId: newBooking.id };
  }
}