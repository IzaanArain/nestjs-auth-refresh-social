import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: '*', 
    credentials: true, // if you're using cookies or auth headers
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser()); // all cookies will be parsed on incoming request & set on the request object
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
