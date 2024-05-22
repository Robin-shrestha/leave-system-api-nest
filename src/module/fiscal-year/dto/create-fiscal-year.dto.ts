import {
  IsNotEmpty,
  IsDateString,
  IsUppercase,
  Length,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { interpolate } from 'src/utils';
import { IsDateAfter } from 'src/validators';
import { validationErrors } from 'src/constants/validationMessages';

export class CreateFiscalYearDto {
  @IsNotEmpty()
  @ApiProperty({ default: '25/26' })
  fiscalYear: string;

  @IsDateString(
    {},
    {
      message: interpolate(validationErrors.DATE_FORMAT, {
        key: 'startDate',
      }),
    },
  )
  @ApiProperty({ default: '2025-05-05', type: Date })
  startDate: string;

  @IsDateString(
    {},
    {
      message: interpolate(validationErrors.DATE_FORMAT, {
        key: 'endDate',
      }),
    },
  )
  @Validate(IsDateAfter, ['startDate'])
  @ApiProperty({ default: '2026-05-04', type: Date })
  endDate: string;

  @IsNotEmpty()
  @IsUppercase()
  @Length(2, 2)
  @ApiProperty({ default: 'NP' })
  countryCode: string;
}
