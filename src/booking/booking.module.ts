import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TheatersModule } from 'src/theaters/theaters.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Showtime]),
    TheatersModule,
],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}