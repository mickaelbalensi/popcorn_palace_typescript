import { Controller, Get, Param, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);  

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // 201
  async createUser(
    @Body() createUserData: { firstName: string; lastName: string; email: string },
  ) {
    const { firstName, lastName, email } = createUserData;
    
    this.logger.log(`Creating user: ${firstName} ${lastName} with email: ${email}`);
    
    const user = await this.usersService.createUser(firstName, lastName, email);
    
    this.logger.log(`User created with ID: ${user.id}`);
    
    return { id: user.id };
  }

  @Get('id/:firstName/:lastName')
  async getUserIdByName(
    @Param('firstName') firstName: string,
    @Param('lastName') lastName: string,
  ) {
    this.logger.log(`Fetching user ID for: ${firstName} ${lastName}`);
    
    const userId = await this.usersService.getUserIdByName(firstName, lastName);
    
    if (userId) {
      this.logger.log(`Found user ID: ${userId}`);
    } else {
      this.logger.warn(`No user found with the name: ${firstName} ${lastName}`);
    }
    
    return { id: userId };
  }
}