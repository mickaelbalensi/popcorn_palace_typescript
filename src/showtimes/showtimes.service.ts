// src/showtimes/showtimes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { Theater } from 'src/theaters/entities/theater.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Theater)
    private theaterRepository: Repository<Theater>,
  ) {}

  // Check for overlapping showtimes
  async checkForOverlap(
    theaterId: number,
    startTime: Date,
    endTime: Date,
    excludeShowtimeId?: number,
  ): Promise<boolean> {
    const overlappingShowtimes = await this.showtimeRepository.find({
      where: [
        {
          theater: { id: theaterId },
          start_time: LessThan(endTime),
          end_time: MoreThan(startTime),
          ...(excludeShowtimeId && { id: Not(excludeShowtimeId) }) // Exclude current showtime when updating
        }
      ],
    });
    return overlappingShowtimes.length > 0;
  }

  // Add a new showtime
  async addShowtime(body: { movieId: number; price: number; theater: string; startTime: string; endTime: string }) {
    const { movieId, price, theater, startTime, endTime } = body;
    
    const theaterEntity = await this.theaterRepository.findOne({ where: { name: theater } });
    const movieEntity = await this.movieRepository.findOne({ where: { id: movieId } });

    // Check if the theater exists
    if (!theaterEntity) {
      throw new Error('Theater not found');
    }

    // Check for overlapping showtimes in the same theater
    const isOverlapping = await this.checkForOverlap(
      theaterEntity.id,
      new Date(startTime),
      new Date(endTime),
    );
    
    if (isOverlapping) {
      throw new Error('There are overlapping showtimes for this theater');
    }

    const newShowtime = this.showtimeRepository.create({
      movie: movieEntity,
      theater: theaterEntity,
      start_time: new Date(startTime),
      end_time: new Date(endTime),
      price,
    });

    const showtime = await this.showtimeRepository.save(newShowtime);
    return {
      id: showtime.id,
      price: showtime.price,
      movieId: showtime.movie.id, 
      theater: showtime.theater.name, 
      startTime: showtime.start_time,
      endTime: showtime.end_time,
    };
  }

  // Update an existing showtime
  async updateShowtime(showtimeId: number, body: { movieId: number; price: number; theater: string; startTime: string; endTime: string }): Promise<Showtime> {
    const { movieId, price, theater, startTime, endTime } = body;
    
    const theaterEntity = await this.theaterRepository.findOne({ where: { name: theater } });
    const movieEntity = await this.movieRepository.findOne({ where: { id: movieId } });

    // Check if the theater exists
    if (!theaterEntity) {
      throw new Error('Theater not found');
    }

    // Check for overlapping showtimes in the same theater
    const isOverlapping = await this.checkForOverlap(
      theaterEntity.id,
      new Date(startTime),
      new Date(endTime),
      showtimeId,
    );

    if (isOverlapping) {
      throw new Error('There are overlapping showtimes for this theater');
    }

    const showtime = await this.showtimeRepository.findOne({ where: { id: showtimeId } });
    
    if (!showtime) {
      throw new Error('Showtime not found');
    }

    showtime.movie = movieEntity;
    showtime.theater = theaterEntity;
    showtime.start_time = new Date(startTime);
    showtime.end_time = new Date(endTime);
    showtime.price = price;

    await this.showtimeRepository.save(showtime);

    return;
  }

  // Delete a showtime
  async deleteShowtime(showtimeId: number): Promise<void> {
    await this.showtimeRepository.delete(showtimeId);
  }

  
  async getAllShowtimes() {
  const showtimes = await this.showtimeRepository.find({
    relations: ['movie', 'theater'], // Load related entities
  });

  // Return the showtimes in the desired format
  return showtimes.map(showtime => ({
    id: showtime.id,
    price: showtime.price,
    movieId: showtime.movie.id,
    theater: showtime.theater.name, // Only the theater name as a string
    startTime: showtime.start_time,
    endTime: showtime.end_time,
  }));
}

  // Get a showtime by ID
  async getShowtimeById(showtimeId: number) {
    const showtime = await this.showtimeRepository.findOne({
      where: { id: showtimeId },
    });

    if (!showtime) {
      throw new Error('Showtime not found');
    }

    return {
      id: showtime.id,
      price: showtime.price,
      movieId: showtime.movie.id,
      theater: showtime.theater.name, 
      startTime: showtime.start_time,
      endTime: showtime.end_time,
    };
  }
}