import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
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

  async findById(id: number) {
    const movie = await this.movieRepository.findOne({ where: { id } });
    this.logger.log('Fetched movie by IIIIDDDD:', JSON.stringify(movie));
    return movie;
  }

  async create(movieData: Partial<Movie>) {
    this.logger.log('Saving movie to the database:', JSON.stringify(movieData)); 
    try {
      const existingMovie = await this.movieRepository.findOne({ 
        where: { title: movieData.title } 
      });
      
      if (existingMovie) {
        this.logger.error(`Movie with title "${movieData.title}" already exists`);
        throw new ConflictException('Movie with this title already exists');
      }
      
      const movie = this.movieRepository.create(movieData);  
      const savedMovie = await this.movieRepository.save(movie); 
      this.logger.log('Movie saved successfully:', JSON.stringify(savedMovie)); 
      return savedMovie;
    } catch (error) {
      this.logger.error('Error saving movie:', error);
      throw error;
    }
  }

  async updateByTitle(title: string, updateData: Partial<Movie>) {
    this.logger.log(`Attempting to update movie with title: ${title}`);

    const movie = await this.movieRepository.findOne({ where: { title } });
    if (!movie) {
      this.logger.error(`Movie with title "${title}" not found!`);
      throw new NotFoundException('Movie not found');
    }

    Object.assign(movie, updateData);
    await this.movieRepository.save(movie);

    this.logger.log(`Movie with title "${title}" updated successfully.`);
    return movie;
  }

  async deleteMovieByTitle(title: string) {
    this.logger.log(`Attempting to delete movie with title: ${title}`);

    const movie = await this.movieRepository.findOne({ where: { title } });

    if (!movie) {
        this.logger.error(`Error: Movie with title "${title}" not found!`);
        throw new NotFoundException('Movie not found');
    }

    await this.movieRepository.delete({ id: movie.id });

    this.logger.log(`Movie with title "${title}" deleted successfully.`);
    return;
  }
}