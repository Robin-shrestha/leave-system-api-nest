import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { StrategyOptions } from 'passport-google-oauth2';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { EnvironmentVariables } from 'src/validators/env.validator';
import { JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class ConfigService {
  constructor(
    private readonly nestConfigService: NestConfigService<EnvironmentVariables>,
  ) {}

  getDatabaseConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.nestConfigService.getOrThrow('DB_HOST'),
      port: this.nestConfigService.getOrThrow('DB_PORT'),
      username: this.nestConfigService.getOrThrow('DB_USER'),
      password: this.nestConfigService.getOrThrow('DB_PASSWORD'),
      database: this.nestConfigService.getOrThrow('DB_DATABASE'),
      autoLoadEntities: true,
      retryAttempts: 3,
      synchronize: this.nestConfigService.getOrThrow('DB_SYNC'),
      logging: false,
    };
  }

  getGoogleAuthConfig(): StrategyOptions {
    return {
      callbackURL: this.nestConfigService.getOrThrow('GOOGLE_CALLBACK_URL'),
      clientID: this.nestConfigService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: this.nestConfigService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      scope: ['email', 'profile'],
    };
  }

  getJwtConfig(): JwtModuleOptions {
    return {
      secret: this.nestConfigService.getOrThrow('JWT_SECRET_KEY'),
      global: true,
    };
  }
}
