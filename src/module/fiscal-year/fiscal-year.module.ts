import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FiscalYearService } from './fiscal-year.service';
import { CountryModule } from '../country/country.module';
import { FiscalYear } from './entities/fiscal-year.entity';
import { FiscalYearController } from './fiscal-year.controller';
import { FiscalYearSeed } from './seed/fiscal-year.seed';

@Module({
  imports: [TypeOrmModule.forFeature([FiscalYear]), CountryModule],
  controllers: [FiscalYearController],
  providers: [FiscalYearService, FiscalYearSeed],
  exports: [FiscalYearService, FiscalYearSeed],
})
export class FiscalYearModule {}
