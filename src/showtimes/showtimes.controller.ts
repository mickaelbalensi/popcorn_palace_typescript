// src/showtimes/showtimes.controller.ts

import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get(':showtimeId')
  async getShowtime(@Param('showtimeId') showtimeId: number) {
    return await this.showtimesService.getShowtimeById(showtimeId);
  }

  @Get()
  async getAllShowtimes() {
    return await this.showtimesService.getAllShowtimes();
  }

  @Post()
  @HttpCode(HttpStatus.OK) 
  async addShowtime(
    @Body() body: { movieId: number; price: number; theater: string; startTime: string; endTime: string }
  ) {
    return await this.showtimesService.addShowtime(body);
  }

  @Post('update/:showtimeId')
  @HttpCode(HttpStatus.OK) 
  async updateShowtime(
    @Param('showtimeId') showtimeId: number,
    @Body() body: { movieId: number; price: number; theater: string; startTime: string; endTime: string }
  ) {
    return await this.showtimesService.updateShowtime(showtimeId, body);
  }

  @Delete(':showtimeId')
  async deleteShowtime(@Param('showtimeId') showtimeId: number) {
    return await this.showtimesService.deleteShowtime(showtimeId);
  }
}