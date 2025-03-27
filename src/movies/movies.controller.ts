import { Controller, Get, Post, Delete, Param, Body, Logger, HttpCode, HttpStatus  } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';

@Controller('movies')
export class MoviesController {
  private readonly logger = new Logger(MoviesController.name);

  constructor(private readonly moviesService: MoviesService) {}

  @Get('all')
  findAll() {
    return this.moviesService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() movieData: Partial<Movie>) {
    this.logger.log('Received movie data:', JSON.stringify(movieData)); // Log incoming data

    return this.moviesService.create(movieData);
  }

  @Post('update/:title')
  @HttpCode(HttpStatus.OK) 
  async updateByTitle(@Param('title') title: string, @Body() updateData: Partial<Movie>): Promise<void> {
    await this.moviesService.updateByTitle(title, updateData);
  }

  @Delete(':title')
  async deleteMovieByTitle(@Param('title') title: string) {
    await this.moviesService.deleteMovieByTitle(title);
  }
}