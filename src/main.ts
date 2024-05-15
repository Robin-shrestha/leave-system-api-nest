import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { initSwagger } from './config/swagger';
import { DefaultExceptionFilter } from './exception-filters/default-exception.filter';
import { DatabaseExceptionFilter } from './exception-filters/database-excpetion.filter';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');

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
