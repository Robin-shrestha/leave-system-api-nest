import { UserSeed } from './module/user/seed/user.seed';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RoleSeeds } from './module/roles/seed/roles.seed';
import { CountrySeed } from './module/country/seed/country.seed';
import { HolidaysSeed } from './module/holidays/seed/holidays.seed';
import { FiscalYearSeed } from './module/fiscal-year/seed/fiscal-year.seed';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly roleSeeds: RoleSeeds,
    private readonly userSeeds: UserSeed,
    private readonly countrySeeds: CountrySeed,
    private readonly fiscalYearSeed: FiscalYearSeed,
    private readonly holidaysSeed: HolidaysSeed,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedData();
  }

  // ? perform seeding with transaction
  async seedData(): Promise<void> {
    await this.countrySeeds.seedCountry();
    await this.roleSeeds.seedRoles();
    await this.fiscalYearSeed.seedFiscalYear();
    await this.holidaysSeed.seedHolidays();
    await this.userSeeds.seedUsers();
  }
}
