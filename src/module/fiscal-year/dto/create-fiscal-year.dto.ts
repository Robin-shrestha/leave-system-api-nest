import {
  IsNotEmpty,
  IsDateString,
  IsUppercase,
  Length,
  Validate,
} from 'class-validator';

import { interpolate } from 'src/utils';
import { IsDateAfter } from 'src/validators';
import { validationErrors } from 'src/constants/validationMessages';

export class CreateFiscalYearDto {
  @IsNotEmpty()
  fiscalYear: string;

  @IsDateString(
    {},
    {
      message: interpolate(validationErrors.DATE_FORMAT, {
        key: 'startDate',
      }),
    },
  )
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
  endDate: string;

  @IsNotEmpty()
  @IsUppercase()
  @Length(2, 2)
  countryCode: string;
}
