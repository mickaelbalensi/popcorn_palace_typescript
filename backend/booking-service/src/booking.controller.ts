//src/booking/booking.controller.ts
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @HttpCode(200) 
  async bookTicket(@Body() bookingData: { showtimeId: number; seatNumber: number; userId: string }) {
    return await this.bookingService.bookTicket(bookingData.showtimeId, bookingData.seatNumber, bookingData.userId);
  }
}