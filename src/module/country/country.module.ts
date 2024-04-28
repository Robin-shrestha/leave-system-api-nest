import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryService } from './country.service';
import { Country } from './entities/country.entity';
import { CountryController } from './country.controller';
import { CountrySeed } from './seed/country.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountryController],
  providers: [CountryService, CountrySeed],
  exports: [CountryService, CountrySeed],
})
export class CountryModule {}
