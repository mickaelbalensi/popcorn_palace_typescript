// src/showtimes/showtimes.controller.ts

import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  // Get showtime by ID
  @Get(':showtimeId')
  async getShowtime(@Param('showtimeId') showtimeId: number) {
    return await this.showtimesService.getShowtimeById(showtimeId);
  }

  @Get()
  async getAllShowtimes() {
    return await this.showtimesService.getAllShowtimes();
  }

  // Add a new showtime
  @Post()
  @HttpCode(HttpStatus.OK) 
  async addShowtime(
    @Body() body: { movieId: number; price: number; theater: string; startTime: string; endTime: string }
  ) {
    return await this.showtimesService.addShowtime(body);
  }

  // Update an existing showtime
  @Post('update/:showtimeId')
  @HttpCode(HttpStatus.OK) 
  async updateShowtime(
    @Param('showtimeId') showtimeId: number,
    @Body() body: { movieId: number; price: number; theater: string; startTime: string; endTime: string }
  ) {
    return await this.showtimesService.updateShowtime(showtimeId, body);
  }

  // Delete a showtime
  @Delete(':showtimeId')
  async deleteShowtime(@Param('showtimeId') showtimeId: number) {
    return await this.showtimesService.deleteShowtime(showtimeId);
  }
}