// src/theaters/theaters.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { Theater } from './entities/theater.entity';
import { Logger } from '@nestjs/common';

@Controller('theaters')
export class TheatersController {
  private readonly logger = new Logger(TheatersController.name);

  constructor(private readonly theatersService: TheatersService) {}

  @Post()
  create(@Body() theaterData: Partial<Theater>) {
    this.logger.log(`Received request to create a new theater: ${JSON.stringify(theaterData)}`);
    return this.theatersService.create(theaterData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() theaterData: Partial<Theater>) {
    this.logger.log(`Received request to update theater with ID: ${id}`);
    return this.theatersService.update(id, theaterData);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    this.logger.log(`Received request to delete theater with ID: ${id}`);
    return this.theatersService.delete(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    this.logger.log(`Received request to fetch theater with ID: ${id}`);
    return this.theatersService.findById(id);
  }

  @Get('/name/:name')
  findByName(@Param('name') name: string) {
    this.logger.log(`Received request to fetch theaters by name: ${name}`);
    return this.theatersService.findByName(name);
  }

  @Get()
  findAll() {
    this.logger.log('Received request to fetch all theaters.');
    return this.theatersService.findAll();
  }
}