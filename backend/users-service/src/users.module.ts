// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
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
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}