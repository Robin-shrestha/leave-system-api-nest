import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (configService: ConfigService) => {
        return configService.getJwtConfig();
      },
      inject: [ConfigService],
    }),
  ],
})
export class JwtModule {}
