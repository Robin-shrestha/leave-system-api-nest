import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country) private countryRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    const country = this.countryRepository.create(createCountryDto);
    await this.countryRepository.insert(country);
  }

  findByCountryCode(countryCode: string) {
    return this.countryRepository.findOneByOrFail({ countryCode });
  }

  findByCountry(countryName: string) {
    return this.countryRepository.findOneByOrFail({ countryName });
  }

  findAll() {
    return this.countryRepository.find();
  }
}
