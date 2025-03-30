import { NestFactory } from '@nestjs/core';
import { ShowtimesModule } from './showtimes.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ShowtimesModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  await app.listen(process.env.PORT || 3002);
  console.log(`Showtimes service is running on: ${await app.getUrl()}`);
}
bootstrap();