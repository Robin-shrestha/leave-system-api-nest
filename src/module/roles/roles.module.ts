import { Module } from '@nestjs/common';
import { Roles } from './entity/roles.entity';
import { RoleSeeds } from './seed/roles.seed';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Roles])],

  controllers: [RolesController],
  providers: [RolesService, RoleSeeds],
  exports: [RolesService, RoleSeeds],
})
export class RolesModule {}
