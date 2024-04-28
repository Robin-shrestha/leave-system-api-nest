import { Module } from '@nestjs/common';
import { UserSeed } from './seed/user.seed';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { UserController } from './user.controller';
import { RolesModule } from '../roles/roles.module';
import { CountryModule } from '../country/country.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), RolesModule, CountryModule],
  controllers: [UserController],
  providers: [UserService, UserSeed],
  exports: [UserService, UserSeed],
})
export class UserModule {}
