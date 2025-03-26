import { Controller, Get, Post, Put, Delete, Param, Body, Logger } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';

@Controller('movies')
export class MoviesController {
  private readonly logger = new Logger(MoviesController.name);

  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Post()
  create(@Body() movieData: Partial<Movie>) {
    this.logger.log('Received movie data:', JSON.stringify(movieData)); // Log incoming data

    return this.moviesService.create(movieData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() movieData: Partial<Movie>) {
    return this.moviesService.update(id, movieData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.moviesService.delete(id);
  }
}