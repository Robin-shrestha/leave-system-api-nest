import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Holidays } from './entities/holiday.entity';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { FiscalYearService } from './../fiscal-year/fiscal-year.service';

@Injectable()
export class HolidaysService {
  constructor(
    private readonly fiscalYearService: FiscalYearService,
    @InjectRepository(Holidays) private holidayRepository: Repository<Holidays>,
  ) {}

  async create(createHolidayDto: CreateHolidayDto) {
    const { fiscalYear, ...rest } = createHolidayDto;

    const fiscalYearEntity = await this.fiscalYearService.findOne(fiscalYear);

    await this.holidayRepository.insert({
      ...rest,
      fiscalYear: fiscalYearEntity,
    });
  }

  findAll() {
    return this.holidayRepository.find({ relations: { fiscalYear: true } });
  }

  findOne(id: number) {
    return this.holidayRepository.findOneOrFail({
      select: {
        fiscalYear: {
          id: true,
          country: { countryCode: true, countryName: true },
          fiscalYear: true,
        },
      },
      where: { id },
      relations: { fiscalYear: { country: true } },
    });
  }

  async update(id: number, updateHolidayDto: UpdateHolidayDto) {
    const holidayEntity = await this.holidayRepository.findOneOrFail({
      where: { id },
      relations: { fiscalYear: true },
    });
    const { fiscalYear, ...rest } = updateHolidayDto;

    if (fiscalYear !== holidayEntity.fiscalYear.id) {
      holidayEntity.fiscalYear =
        await this.fiscalYearService.findOne(fiscalYear);
    }

    return this.holidayRepository.save({
      ...holidayEntity,
      ...rest,
    });
  }

  async remove(id: number) {
    await this.holidayRepository.softDelete(id);
  }
}
