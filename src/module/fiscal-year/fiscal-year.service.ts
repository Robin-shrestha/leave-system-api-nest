import { Injectable } from '@nestjs/common';
import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
import { CountryService } from '../country/country.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FiscalYear } from './entities/fiscal-year.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FiscalYearService {
  constructor(
    private readonly countryService: CountryService,
    @InjectRepository(FiscalYear)
    private fiscalYearRepository: Repository<FiscalYear>,
  ) {}

  async create(createFiscalYearDto: CreateFiscalYearDto) {
    const { countryCode, ...rest } = createFiscalYearDto;
    const associatedCountry =
      await this.countryService.findByCountryCode(countryCode);

    await this.fiscalYearRepository.insert({
      ...rest,
      country: associatedCountry,
    });
  }

  // test transaction
  async SaveInBulk(createFiscalYearDto: CreateFiscalYearDto[]) {
    await this.fiscalYearRepository.manager.transaction(async (manager) => {
      const entityMap = [];
      for (let i = 0; i < createFiscalYearDto.length; i++) {
        const { countryCode, ...rest } = createFiscalYearDto[i];

        const associatedCountry =
          await this.countryService.findByCountryCode(countryCode);

        entityMap.push(
          manager.insert(FiscalYear, {
            ...rest,
            country: associatedCountry,
          }),
        );
      }
      await Promise.all(entityMap);
    });
  }

  findAll() {
    return this.fiscalYearRepository.find();
  }

  findOne(id: number) {
    return this.fiscalYearRepository.findOneByOrFail({ id });
  }
}
