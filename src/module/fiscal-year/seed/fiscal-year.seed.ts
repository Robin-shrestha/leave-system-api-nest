import { Injectable, Logger } from '@nestjs/common';
import { FiscalYearService } from '../fiscal-year.service';
import { CreateFiscalYearDto } from '../dto/create-fiscal-year.dto';

const fiscalYear: CreateFiscalYearDto[] = [
  {
    countryCode: 'NP',
    startDate: '2022-05-05',
    endDate: '2023-05-04',
    fiscalYear: '22/23',
  },
  {
    countryCode: 'NP',
    startDate: '2023-05-05',
    endDate: '2024-05-04',
    fiscalYear: '23/24',
  },
  {
    countryCode: 'NP',
    startDate: '2024-05-05',
    endDate: '2025-05-04',
    fiscalYear: '24/25',
  },
];

@Injectable()
export class FiscalYearSeed {
  private readonly logger = new Logger(FiscalYearSeed.name);
  constructor(private readonly fiscalYearService: FiscalYearService) {}

  async seedFiscalYear() {
    const existingCountries = await this.fiscalYearService.findAll();

    if (!existingCountries.data.length) {
      await Promise.all(
        fiscalYear.map((fy) => this.fiscalYearService.create(fy)),
      );
      this.logger.log(
        `Fiscal Year seeded: ${fiscalYear.map((fy) => fy.fiscalYear).join(', ')}`,
      );
    }
  }
}
