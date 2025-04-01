// src/theaters/theaters.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TheatersService } from './theaters.service';
import { TheatersController } from './theaters.controller';
import { Theater } from './entities/theater.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Theater])],
  controllers: [TheatersController],
  providers: [TheatersService],
  exports: [TypeOrmModule],
})
export class TheatersModule {}