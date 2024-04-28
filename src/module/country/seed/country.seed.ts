import { Injectable, Logger } from '@nestjs/common';
import { CountryService } from '../country.service';
import { CreateCountryDto } from '../dto/create-country.dto';

const countries: CreateCountryDto[] = [
  { countryName: 'Nepal', countryCode: 'NP' },
  { countryName: 'USA', countryCode: 'US' },
  { countryName: 'India', countryCode: 'IN' },
];

@Injectable()
export class CountrySeed {
  private readonly logger = new Logger(CountrySeed.name);
  constructor(private readonly countryService: CountryService) {}

  async seedCountry() {
    const existingCountries = await this.countryService.findAll();

    if (!existingCountries.length) {
      await Promise.all(
        countries.map((country) => this.countryService.create(country)),
      );
      this.logger.log(
        `countries seeded: ${countries.map((country) => country.countryName).join(', ')}`,
      );
    }
  }
}
