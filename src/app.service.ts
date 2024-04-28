import { UserSeed } from './module/user/seed/user.seed';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RoleSeeds } from './module/roles/seed/roles.seed';
import { CountrySeed } from './module/country/seed/country.seed';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly roleSeeds: RoleSeeds,
    private readonly userSeeds: UserSeed,
    private readonly countrySeeds: CountrySeed,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedData();
  }

  async seedData(): Promise<void> {
    await this.countrySeeds.seedCountry();
    await this.roleSeeds.seedRoles();
    await this.userSeeds.seedUsers();
  }
}
