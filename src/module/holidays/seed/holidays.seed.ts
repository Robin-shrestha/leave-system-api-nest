import { Injectable, Logger } from '@nestjs/common';
import { HolidaysService } from '../holidays.service';
import { CreateHolidayDto } from '../dto/create-holiday.dto';
import { FiscalYearService } from 'src/module/fiscal-year/fiscal-year.service';

const holidays: Omit<CreateHolidayDto, 'fiscalYearId'>[] = [
  {
    date: '2024-08-05',
    name: 'Holiday 1',
  },
  {
    date: '2024-07-25',
    name: 'Holiday 1',
  },
  {
    date: '2024-11-19',
    name: 'Holiday 1',
  },
];

@Injectable()
export class HolidaysSeed {
  private readonly logger = new Logger(HolidaysSeed.name);
  constructor(
    private readonly holidayService: HolidaysService,
    private readonly fiscalYearService: FiscalYearService,
  ) {}

  async seedHolidays() {
    const existingHolidays = await this.holidayService.findAll();

    const seedFiscalYear = (await this.fiscalYearService.findAll())[0];

    if (!existingHolidays.length) {
      await Promise.all(
        holidays.map((holiday) =>
          this.holidayService.create({
            ...holiday,
            fiscalYearId: seedFiscalYear.id,
          }),
        ),
      );
      this.logger.log(
        `Holidays seeded: ${holidays.map((holiday) => holiday.name).join(', ')}`,
      );
    }
  }
}
