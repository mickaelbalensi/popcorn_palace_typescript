// src/users/user.controllers.ts
import { Controller, Get, Param, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // 201
  async createUser(
    @Body() createUserData: { firstName: string; lastName: string; email: string },
  ) {
    const { firstName, lastName, email } = createUserData;
    const user = await this.usersService.createUser(firstName, lastName, email);
    return { id: user.id }; 
  }

  @Get('id/:firstName/:lastName')
  async getUserIdByName(
    @Param('firstName') firstName: string,
    @Param('lastName') lastName: string,
  ) {
    const userId = await this.usersService.getUserIdByName(firstName, lastName);
    return { id: userId }; 
  }
}