import { DataSource, QueryRunner } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { Users } from '../user/entities/users.entity';
import { Country } from '../country/entities/country.entity';
import { Holidays } from '../holidays/entities/holiday.entity';
import { UserLeave } from '../user-leave/entities/user-leave.entity';
import { LeaveType } from '../leave-types/entities/leave-type.entity';
import { FiscalYear } from '../fiscal-year/entities/fiscal-year.entity';
import { LeavePolicy } from '../leave-policy/entities/leave-policy.entity';

import type {
  SeedCountryDTO,
  SeedFiscalYearDto,
  SeedHolidayDto,
  SeedLeavePolicyDTO,
  SeedLeaveTypeDTO,
  SeedUsersDTO,
} from './seed.types';
import { defaultSeedData } from './seedData';

/**
 * TODO can be extended to read csvs i guess
 */
@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private dataSource: DataSource) {}

  seedWithCsvData() {
    throw new Error('NOt Implemented!');
  }

  async seedAllWithTestData(seed: boolean = false) {
    if (!seed) return;

    const queryRunner = this.dataSource.createQueryRunner();
    this.logger.log('SEEDING DEFAULTS!');

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //  seeding Countries
      await this.seedCountries(queryRunner, defaultSeedData.countries);

      //  seeding Leave Types
      await this.seedLeaveTypes(queryRunner, defaultSeedData.leaveTypes);

      // seeding fiscal year
      await this.seedFiscalYears(queryRunner, defaultSeedData.fiscalYears);

      // seeding Holidays
      await this.seedHolidays(queryRunner, defaultSeedData.holidays);

      // seeding Leave Policies
      await this.seedLeavePolicies(queryRunner, defaultSeedData.leavePolicies);

      // Seeding Users
      await this.seedUsers(queryRunner, defaultSeedData.users);

      // Seeding user leave policies
      await this.seedUserLeaves(queryRunner);

      await queryRunner.commitTransaction();

      this.logger.log('SEEDING DEFAULTS SUCCESS!!');
    } catch (error) {
      this.logger.error(error.message);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async seedCountries(queryRunner: QueryRunner, countries: SeedCountryDTO[]) {
    const countryEntities = queryRunner.manager.create(Country, countries);

    await queryRunner.manager.insert(Country, countryEntities);

    this.logger.log('Countries Seeded!');
  }

  async seedLeaveTypes(
    queryRunner: QueryRunner,
    leaveTypes: SeedLeaveTypeDTO[],
  ) {
    const leaveTypeEntities = queryRunner.manager.create(LeaveType, leaveTypes);

    await queryRunner.manager.insert(LeaveType, leaveTypeEntities);

    this.logger.log('Leave Types Seeded!');
  }

  async seedFiscalYears(
    queryRunner: QueryRunner,
    fiscalYears: SeedFiscalYearDto[],
  ) {
    const fiscalYearEntities: FiscalYear[] = [];
    const countryMap: Record<string, Country> = {};

    for (const fiscalYear of fiscalYears) {
      if (!countryMap[fiscalYear.countryCode]) {
        const country = await queryRunner.manager.findOneByOrFail(Country, {
          countryCode: fiscalYear.countryCode,
        });

        countryMap[fiscalYear.countryCode] = country;
      }
      fiscalYearEntities.push(
        queryRunner.manager.create(FiscalYear, {
          ...fiscalYear,
          country: countryMap[fiscalYear.countryCode],
        }),
      );
    }

    await queryRunner.manager.insert(FiscalYear, fiscalYearEntities);

    this.logger.log('Fiscal Year Seeded!');
  }

  async seedHolidays(queryRunner: QueryRunner, holidays: SeedHolidayDto[]) {
    const holidayEntities: Holidays[] = [];

    for (const holiday of holidays) {
      const fiscalYear = await queryRunner.manager.findOneByOrFail(FiscalYear, {
        country: { countryCode: holiday.countryCode },
        fiscalYear: holiday.fiscalYear,
      });

      holidayEntities.push(
        queryRunner.manager.create(Holidays, {
          ...holiday,
          fiscalYear,
        }),
      );
    }

    await queryRunner.manager.insert(Holidays, holidayEntities);

    this.logger.log('Holidays Seeded!');
  }

  async seedLeavePolicies(
    queryRunner: QueryRunner,
    leavePolicies: SeedLeavePolicyDTO[],
  ) {
    const leavePolicyEntities: LeavePolicy[] = [];

    for (const leavePolicy of leavePolicies) {
      const fiscalYear = await queryRunner.manager.findOneByOrFail(FiscalYear, {
        country: { countryCode: leavePolicy.countryCode },
        fiscalYear: leavePolicy.fiscalYear,
      });

      const leaveType = await queryRunner.manager.findOneByOrFail(LeaveType, {
        type: leavePolicy.leaveType,
      });

      leavePolicyEntities.push(
        queryRunner.manager.create(LeavePolicy, {
          ...leavePolicy,
          fiscalYear,
          leaveType,
        }),
      );
    }

    await queryRunner.manager.insert(LeavePolicy, leavePolicyEntities);
    this.logger.log('Leave Policies Seeded!');
  }

  async seedUsers(queryRunner: QueryRunner, users: SeedUsersDTO[]) {
    const countryMap: Map<string, Country> = new Map();
    const userEntities: Users[] = [];

    for (const user of users) {
      if (!countryMap.has(user.countryCode)) {
        const country = await queryRunner.manager.findOneByOrFail(Country, {
          countryCode: user.countryCode,
        });

        countryMap.set(user.countryCode, country);
      }

      userEntities.push(
        queryRunner.manager.create(Users, {
          ...user,
          country: countryMap.get(user.countryCode),
        }),
      );
    }

    await queryRunner.manager.insert(Users, userEntities);

    this.logger.log('Users Seeded!');
  }

  async seedUserLeaves(queryRunner: QueryRunner) {
    const users = await queryRunner.manager.find(Users);

    const leavePolicies = await queryRunner.manager.find(LeavePolicy, {
      relations: { leaveType: true },
    });
    const userLeaveEntities: UserLeave[] = [];

    for (const user of users) {
      for (const leavePolicy of leavePolicies) {
        if (leavePolicy.leaveType.affectedGender) {
          if (user.gender === leavePolicy.leaveType.affectedGender) {
            const userLeaveEntity = queryRunner.manager.create(UserLeave, {
              additionalDays: 0,
              leavePolicy,
              user,
            });
            userLeaveEntities.push(userLeaveEntity);
          }
          continue;
        }
        const userLeaveEntity = queryRunner.manager.create(UserLeave, {
          additionalDays: 0,
          leavePolicy,
          user,
        });

        userLeaveEntities.push(userLeaveEntity);
      }
    }
    await queryRunner.manager.insert(UserLeave, userLeaveEntities);

    this.logger.log('User Leave Entities Seeded!');
  }
}
