// src/showtimes/showtimes.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { Theater } from 'src/theaters/entities/theater.entity';

@Injectable()
export class ShowtimesService {
  private readonly logger = new Logger(ShowtimesService.name);

  constructor(
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
  ) {}

  async addShowtime(showtimeData: Partial<Showtime>) {
    this.logger.log(`Attempting to add new showtime: ${JSON.stringify(showtimeData)}`);

    // Check for overlapping showtimes
    const overlappingShowtimes = await this.showtimeRepository.find({
      where: {
        theater: { id: showtimeData.theater.id },
        start_time: { $lt: showtimeData.end_time },
        end_time: { $gt: showtimeData.start_time },
      },
    });

    if (overlappingShowtimes.length > 0) {
      this.logger.error('Error: Overlapping showtimes detected!');
      throw new Error('There are overlapping showtimes for this theater.');
    }

    const newShowtime = this.showtimeRepository.create(showtimeData);
    await this.showtimeRepository.save(newShowtime);

    this.logger.log(`Showtime added successfully: ${JSON.stringify(newShowtime)}`);
    return newShowtime;
  }

  async updateShowtime(id: number, showtimeData: Partial<Showtime>) {
    this.logger.log(`Attempting to update showtime with ID: ${id}`);

    await this.showtimeRepository.update(id, showtimeData);
    const updatedShowtime = await this.showtimeRepository.findOne(id);

    this.logger.log(`Showtime updated successfully: ${JSON.stringify(updatedShowtime)}`);
    return updatedShowtime;
  }

  async deleteShowtime(id: number) {
    this.logger.log(`Attempting to delete showtime with ID: ${id}`);

    const showtime = await this.showtimeRepository.findOne(id);
    if (!showtime) {
      this.logger.error('Error: Showtime not found!');
      throw new Error('Showtime not found');
    }

    await this.showtimeRepository.remove(showtime);
    this.logger.log(`Showtime with ID ${id} deleted successfully.`);
  }

  async findShowtimeById(id: number) {
    this.logger.log(`Fetching showtime with ID: ${id}`);

    const showtime = await this.showtimeRepository.findOne(id);
    if (!showtime) {
      this.logger.error('Error: Showtime not found!');
      throw new Error('Showtime not found');
    }

    this.logger.log(`Fetched showtime: ${JSON.stringify(showtime)}`);
    return showtime;
  }
}