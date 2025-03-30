// src/theaters/theaters.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theater } from './entities/theater.entity';

@Injectable()
export class TheatersService {
  
  private readonly logger = new Logger(TheatersService.name);

  constructor(
    @InjectRepository(Theater)
    private theaterRepository: Repository<Theater>,
  ) {}

  async create(theaterData: Partial<Theater>) {
    this.logger.log(`Attempting to create a new theater: ${JSON.stringify(theaterData)}`);

    const newTheater = this.theaterRepository.create(theaterData);
    await this.theaterRepository.save(newTheater);

    this.logger.log(`Theater created successfully: ${JSON.stringify(newTheater)}`);
    return newTheater;
  }

  async update(id: number, theaterData: Partial<Theater>) {
    this.logger.log(`Attempting to update theater with ID: ${id}`);

    await this.theaterRepository.update(id, theaterData);
    const updatedTheater = await this.theaterRepository.findOne({ where: { id } });

    this.logger.log(`Theater updated successfully: ${JSON.stringify(updatedTheater)}`);
    return updatedTheater;
  }

  async delete(id: number) {
    this.logger.log(`Attempting to delete theater with ID: ${id}`);

    const theater = await this.theaterRepository.findOne({ where: { id } });
    if (!theater) {
      this.logger.error('Error: Theater not found!');
      throw new Error('Theater not found');
    }

    await this.theaterRepository.remove(theater);
    this.logger.log(`Theater with ID ${id} deleted successfully.`);
  }

  async findById(id: number) {
    this.logger.log(`Fetching theater with ID: ${id}`);

    const theater = await this.theaterRepository.findOne({ where: { id } });
    if (!theater) {
      this.logger.error('Error: Theater not found!');
      throw new Error('Theater not found');
    }

    this.logger.log(`Fetched theater: ${JSON.stringify(theater)}`);
    return theater;
  }

  async findByName(name: string) {
    this.logger.log(`Fetching theater with name: ${name}`);

    const theater = await this.theaterRepository.findOne({ where: { name } });
    if (!theater) {
      this.logger.error('Error: Theater not found!');
      throw new Error('Theater not found');
    }

    this.logger.log(`Fetched theater: ${JSON.stringify(theater)}`);
    return theater;
  }

  async findAll() {
    this.logger.log('Fetching all theaters.');

    const theaters = await this.theaterRepository.find();
    this.logger.log(`Fetched theaters: ${JSON.stringify(theaters)}`);
    return theaters;
  }
}