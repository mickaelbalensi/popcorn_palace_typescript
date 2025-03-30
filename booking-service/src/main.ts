import { NestFactory } from '@nestjs/core';
import { BookingModule } from './booking.module';

async function bootstrap() {
  const app = await NestFactory.create(BookingModule);
  await app.listen(3005);
  console.log(`🚀 Users service is running on: http://localhost:3005`);
}
bootstrap();