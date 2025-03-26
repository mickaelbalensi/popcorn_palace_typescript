import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async findAll() {
    const movies = await this.movieRepository.find();
    this.logger.log('Fetched movies:', JSON.stringify(movies));
    return movies;
  }

  async create(movieData: Partial<Movie>) {
    this.logger.log('Saving movie to the database:', JSON.stringify(movieData)); // Log before saving
    try {
      const savedMovie = await this.movieRepository.save(movieData);
      this.logger.log('Movie saved successfully:', JSON.stringify(savedMovie)); // Log after saving
      return savedMovie;
    } catch (error) {
      this.logger.error('Error saving movie:', error);
      throw error;
    }
  }

  // Update movie by ID
  async update(id: number, movieData: Partial<Movie>) {
    this.logger.log(`Attempting to update movie with ID: ${id}`);

    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      this.logger.error(`Movie with ID ${id} not found for update`);
      throw new Error('Movie not found');
    }

    // Log the movie data before updating
    this.logger.log(`Current movie data: ${JSON.stringify(movie)}`);
    Object.assign(movie, movieData);

    const updatedMovie = await this.movieRepository.save(movie);
    this.logger.log(`Movie updated successfully with ID: ${id}`);
    this.logger.log(`Updated movie data: ${JSON.stringify(updatedMovie)}`);

    return updatedMovie;
  }

  // Delete movie by ID
  async delete(id: string) {
    this.logger.log(`Attempting to delete movie with ID: ${id}`);

    const result = await this.movieRepository.delete(id);
    if (result.affected === 0) {
      this.logger.error(`Movie with ID ${id} not found for deletion`);
      throw new Error('Movie not found');
    }

    this.logger.log(`Movie with ID ${id} deleted successfully`);
    return { message: 'Movie deleted successfully' };
  }
}