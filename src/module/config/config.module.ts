import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';
import { isEnvValid } from 'src/validators/env.validator';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: isEnvValid,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
