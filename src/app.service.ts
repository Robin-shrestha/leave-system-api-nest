import { UserSeed } from './module/user/seed/user.seed';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RoleSeeds } from './module/roles/seed/roles.seed';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly roleSeeds: RoleSeeds,
    private readonly userSeeds: UserSeed,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedData();
  }

  async seedData(): Promise<void> {
    await this.roleSeeds.seedRoles();
    await this.userSeeds.seedUsers();
  }
}
