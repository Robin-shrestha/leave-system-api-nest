import { IsDateString, IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { validationErrors } from 'src/constants/validationMessages';
import { interpolate } from 'src/utils';
import { IsDateAfter, IsDateBefore } from 'src/validators';

export class CreateLeaveRecordDto {
  @IsNotEmpty()
  @IsDateString(
    {},
    {
      message: interpolate(validationErrors.DATE_FORMAT, {
        key: 'startDate',
      }),
    },
  )
  @Validate(IsDateBefore, ['endDate', true])
  startDate: string;

  @IsNotEmpty()
  @IsDateString(
    {},
    {
      message: interpolate(validationErrors.DATE_FORMAT, {
        key: 'endDate',
      }),
    },
  )
  @Validate(IsDateAfter, ['startDate', true])
  endDate: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  userLeavePolicyId: number; // user ko ho, kasto leave lina lageko, tyo leave kun country/fy ko ho vanera
}
