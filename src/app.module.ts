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
      host: 'localhost',
      port: 5432,
      username: 'popcorn-palace',
      password: 'popcorn-palace',
      database: 'popcorn-palace',
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
