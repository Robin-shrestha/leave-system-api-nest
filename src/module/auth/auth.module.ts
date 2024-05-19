import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthController } from './auth.controller';
import { Users } from '../user/entities/users.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '../config/config.module';
import { CountryModule } from '../country/country.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { AccessControlService } from './accessControl.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    ConfigModule,
    CountryModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    AccessControlService,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, AccessControlService],
})
export class AuthModule {}
