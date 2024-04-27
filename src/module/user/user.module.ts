import { Module } from '@nestjs/common';
import { UserSeed } from './seed/user.seed';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { UserController } from './user.controller';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), RolesModule],
  controllers: [UserController],
  providers: [UserService, UserSeed],
  exports: [UserService, UserSeed],
})
export class UserModule {}
