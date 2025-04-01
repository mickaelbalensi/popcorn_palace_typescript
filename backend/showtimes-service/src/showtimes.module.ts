import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { Showtime } from './entities/showtimes.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME || 'popcorn-palace',
      password: process.env.DATABASE_PASSWORD || 'popcorn-palace',
      database: process.env.DATABASE_NAME || 'popcorn-palace',
      entities: [Showtime],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Showtime]),
    HttpModule,
  ],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
})
export class ShowtimesModule {}