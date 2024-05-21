import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Injectable } from '@nestjs/common';
import { PaginatedResult, PaginationDto } from 'src/utils';
import { FiscalYear } from './entities/fiscal-year.entity';
import { CountryService } from '../country/country.service';
import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';

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

  async findAll(paginationDto: PaginationDto = {}) {
    const { limit = 10, page = 1 } = paginationDto;
    const [res, total] = await this.fiscalYearRepository.findAndCount({
      relations: { country: true, holiday: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return new PaginatedResult(res, {
      page,
      total,
      limit,
    });
  }

  findOne(id: number) {
    return this.fiscalYearRepository.findOneOrFail({
      where: { id },
      relations: { country: true, holiday: true },
    });
  }
}
