import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  await app.listen(3004);
  console.log(`🚀 Users service is running on: http://localhost:3004`);
}
bootstrap();