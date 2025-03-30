import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus } from '@nestjs/common';
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
  @HttpCode(HttpStatus.CREATED)
  async addShowtime(
    @Body() body: { movieId: number; theater: string; price: number; startTime: string; endTime: string }
  ) {
    return await this.showtimesService.addShowtime(body);
  }

  @Put(':showtimeId')
  async updateShowtime(
    @Param('showtimeId') showtimeId: number,
    @Body() body: { movieId: number; theaterId: number; price: number; startTime: string; endTime: string }
  ) {
    return await this.showtimesService.updateShowtime(showtimeId, body);
  }

  @Delete(':showtimeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteShowtime(@Param('showtimeId') showtimeId: number) {
    return await this.showtimesService.deleteShowtime(showtimeId);
  }
}