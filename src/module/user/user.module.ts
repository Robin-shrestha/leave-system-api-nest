import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { UserSeed } from './seed/user.seed';
import { UserService } from './user.service';
import { Users } from './entities/users.entity';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { CountryModule } from '../country/country.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    CountryModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserSeed],
  exports: [UserService, UserSeed],
})
export class UserModule {}
