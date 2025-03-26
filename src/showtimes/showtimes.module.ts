// src/showtimes/showtimes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { Showtime } from './entities/showtime.entity';
import { Theater } from 'src/theaters/entities/theater.entity';
import { Movie } from 'src/movies/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime, Theater, Movie])],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
})
export class ShowtimesModule {}