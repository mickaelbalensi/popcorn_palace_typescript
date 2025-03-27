import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name); // Logger instance for this service

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(firstName: string, lastName: string, email: string): Promise<User> {
    this.logger.log(`Attempting to create user with email: ${email}`);
    
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      this.logger.error(`User with email ${email} already exists`);
      throw new ConflictException('User with this email already exists');
    }

    const newUser = this.userRepository.create({ firstName, lastName, email });
    await this.userRepository.save(newUser);
    this.logger.log(`User created successfully: ${newUser.id}`);

    return newUser;
  }

  async getUserIdByName(firstName: string, lastName: string): Promise<string> {
    this.logger.log(`Attempting to get user ID by name: ${firstName} ${lastName}`);
    
    const user = await this.userRepository.findOne({ where: { firstName, lastName } });

    if (!user) {
      this.logger.error(`User with name ${firstName} ${lastName} not found`);
      throw new NotFoundException(`User with name ${firstName} ${lastName} not found`);
    }

    this.logger.log(`Found user with ID: ${user.id}`);
    return user.id;
  }
}