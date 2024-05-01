import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidaysSeed } from './seed/holidays.seed';
import { Holidays } from './entities/holiday.entity';
import { HolidaysService } from './holidays.service';
import { HolidaysController } from './holidays.controller';
import { FiscalYearModule } from '../fiscal-year/fiscal-year.module';

@Module({
  imports: [TypeOrmModule.forFeature([Holidays]), FiscalYearModule],
  controllers: [HolidaysController],
  providers: [HolidaysService, HolidaysSeed],
  exports: [HolidaysService, HolidaysSeed],
})
export class HolidaysModule {}
