import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { TheatersModule } from './theaters/theaters.module';
import { BookingModule } from './booking/booking.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'db', 
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'popcorn-palace',
      password: process.env.DATABASE_PASSWORD || 'popcorn-palace',
      database: process.env.DATABASE_NAME || 'popcorn-palace',
      autoLoadEntities: true,
      synchronize: true, 
    }),
    MoviesModule,
    ShowtimesModule,
    TheatersModule,
    BookingModule, 
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}