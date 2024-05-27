import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { initSwagger } from './config/swagger';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import { DefaultExceptionFilter } from './exception-filters/default-exception.filter';
import { DatabaseExceptionFilter } from './exception-filters/database-excpetion.filter';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  const PORT = configService.get<number>('PORT');

  const environment = configService.get<string>('NODE_ENV') || 'development';

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: environment === 'development',
    }),
  );

  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // ? default exception filter goes first
  app.useGlobalFilters(new DefaultExceptionFilter());
  app.useGlobalFilters(new DatabaseExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  initSwagger(app);

  await app.listen(PORT, () => {
    console.log('Running on port ', PORT);
  });
}
bootstrap();
