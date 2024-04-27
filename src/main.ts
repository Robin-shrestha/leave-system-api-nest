import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

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

  await app.listen(PORT, () => {
    console.log('running on port ', PORT);
    console.log('environment:', environment);
  });
}
bootstrap();
