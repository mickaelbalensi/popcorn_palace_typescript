// src/showtimes/showtimes.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { Showtime } from './entities/showtime.entity';
import { Logger } from '@nestjs/common';

@Controller('showtimes')
export class ShowtimesController {
  private readonly logger = new Logger(ShowtimesController.name);

  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  create(@Body() showtimeData: Partial<Showtime>) {
    this.logger.log(`Received request to add a new showtime: ${JSON.stringify(showtimeData)}`);
    return this.showtimesService.addShowtime(showtimeData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() showtimeData: Partial<Showtime>) {
    this.logger.log(`Received request to update showtime with ID: ${id}`);
    return this.showtimesService.updateShowtime(id, showtimeData);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    this.logger.log(`Received request to delete showtime with ID: ${id}`);
    return this.showtimesService.deleteShowtime(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    this.logger.log(`Received request to fetch showtime with ID: ${id}`);
    return this.showtimesService.findShowtimeById(id);
  }
}