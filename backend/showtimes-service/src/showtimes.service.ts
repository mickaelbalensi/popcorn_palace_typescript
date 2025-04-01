import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Showtime } from './entities/showtimes.entity';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config'; 

@Injectable()
export class ShowtimesService {
  private readonly logger = new Logger(ShowtimesService.name);
  private readonly moviesServiceUrl: string;
  private readonly theatersServiceUrl: string;

  constructor(
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.moviesServiceUrl = this.configService.get<string>('MOVIES_SERVICE_URL') || 'http://movies-service:3001';
    this.theatersServiceUrl = this.configService.get<string>('THEATERS_SERVICE_URL') || 'http://theaters-service:3002';
  }

  async checkForOverlap(
    theaterId: number,
    startTime: Date,
    endTime: Date,
    excludeShowtimeId?: number,
  ): Promise<boolean> {
    this.logger.debug(`Checking for overlap in theater ${theaterId} from ${startTime} to ${endTime}`);
    const overlappingShowtimes = await this.showtimeRepository.find({
      where: [
        {
          theaterId,
          startTime: LessThan(endTime),
          endTime: MoreThan(startTime),
          ...(excludeShowtimeId && { id: Not(excludeShowtimeId) }),
        },
      ],
    });
    this.logger.debug(`Found ${overlappingShowtimes.length} overlapping showtimes`);
    return overlappingShowtimes.length > 0;
  }

  async getMovieById(movieId: number) {
    this.logger.log(`Fetching movie with ID: ${movieId}`);
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.moviesServiceUrl}/movies/${movieId}`)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Movie with ID ${movieId} not found`);
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }
  }

  async getTheaterById(theaterId: number) {
    this.logger.log(`Fetching theater with ID: ${theaterId}`);
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.theatersServiceUrl}/theaters/${theaterId}`)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Theater with ID ${theaterId} not found`);
      throw new HttpException('Theater not found', HttpStatus.NOT_FOUND);
    }
  }

  async getTheaterByName(theaterName: string) {
    this.logger.log(`Fetching theater with name: ${theaterName}`);
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.theatersServiceUrl}/theaters/name/${theaterName}`)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Theater with name ${theaterName} not found`);
      throw new HttpException('Theater not found', HttpStatus.NOT_FOUND);
    }
  }

  async addShowtime(body: { movieId: number; theater: string; price: number; startTime: string; endTime: string }) {
    this.logger.log(`Adding new showtime: ${JSON.stringify(body)}`);
    const { movieId, theater, price, startTime, endTime } = body;

    await this.getMovieById(movieId);
    const theaterDetails = await this.getTheaterByName(theater);
    const theaterId = theaterDetails.id;

    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);

    if (await this.checkForOverlap(theaterId, startTimeDate, endTimeDate)) {
      this.logger.warn('Overlapping showtime detected');
      throw new HttpException('There are overlapping showtimes for this theater', HttpStatus.BAD_REQUEST);
    }

    const newShowtime = this.showtimeRepository.create({ movieId, theaterId, startTime: startTimeDate, endTime: endTimeDate, price });
    const showtime = await this.showtimeRepository.save(newShowtime);
    
    this.logger.log(`Showtime added with ID: ${showtime.id}`);
    return showtime;
  }

  async updateShowtime(showtimeId: number, body: { movieId: number; theaterId: number; price: number; startTime: string; endTime: string }): Promise<Showtime> {
    this.logger.log(`Updating showtime ID: ${showtimeId} with data: ${JSON.stringify(body)}`);
    
    const { movieId, theaterId, price, startTime, endTime } = body;
    await this.getMovieById(movieId);
    await this.getTheaterById(theaterId);

    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);

    if (await this.checkForOverlap(theaterId, startTimeDate, endTimeDate, showtimeId)) {
      this.logger.warn('Overlapping showtime detected');
      throw new HttpException('There are overlapping showtimes for this theater', HttpStatus.BAD_REQUEST);
    }

    const showtime = await this.showtimeRepository.findOne({ where: { id: showtimeId } });
    if (!showtime) {
      this.logger.error(`Showtime with ID ${showtimeId} not found`);
      throw new HttpException('Showtime not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(showtime, { movieId, theaterId, price, startTime: startTimeDate, endTime: endTimeDate });
    const updatedShowtime = await this.showtimeRepository.save(showtime);
    
    this.logger.log(`Showtime ID: ${updatedShowtime.id} updated successfully`);
    return updatedShowtime;
  }

  async deleteShowtime(showtimeId: number): Promise<void> {
    this.logger.log(`Deleting showtime with ID: ${showtimeId}`);
    const result = await this.showtimeRepository.delete(showtimeId);
    if (result.affected === 0) {
      this.logger.error(`Showtime with ID ${showtimeId} not found`);
      throw new HttpException('Showtime not found', HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Showtime ID: ${showtimeId} deleted successfully`);
  }

  async getAllShowtimes() {
    this.logger.log(`Fetching all showtimes`);
    const showtimes = await this.showtimeRepository.find();
    
    const detailedShowtimes = await Promise.all(
      showtimes.map(async (showtime) => {
        const movie = await this.getMovieById(showtime.movieId);
        const theater = await this.getTheaterById(showtime.theaterId);
        
        return { id: showtime.id, price: showtime.price, movieId: showtime.movieId, movieTitle: movie.title, theaterId: showtime.theaterId, theaterName: theater.name, startTime: showtime.startTime, endTime: showtime.endTime };
      })
    );

    this.logger.log(`Fetched ${detailedShowtimes.length} showtimes`);
    return detailedShowtimes;
  }

  async getShowtimeById(showtimeId: number) {
    this.logger.log(`Fetching showtime with ID: ${showtimeId}`);
    const showtime = await this.showtimeRepository.findOne({ where: { id: showtimeId } });

    if (!showtime) {
      this.logger.error(`Showtime with ID ${showtimeId} not found`);
      throw new HttpException('Showtime not found', HttpStatus.NOT_FOUND);
    }

    const movie = await this.getMovieById(showtime.movieId);
    const theater = await this.getTheaterById(showtime.theaterId);

    return { id: showtime.id, price: showtime.price, movieId: showtime.movieId, movieTitle: movie.title, theaterId: showtime.theaterId, theaterName: theater.name, startTime: showtime.startTime, endTime: showtime.endTime };
  }
}