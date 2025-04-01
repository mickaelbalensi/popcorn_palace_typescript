// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Booking]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'popcorn-palace',
      password: process.env.DATABASE_PASSWORD || 'popcorn-palace',
      database: process.env.DATABASE_NAME || 'popcorn-palace',
      autoLoadEntities: true,
      synchronize: true,

    }),
    HttpModule,
  
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}