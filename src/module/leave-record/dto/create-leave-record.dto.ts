import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: '2024-10-10' })
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
  @ApiProperty({ example: '2024-10-10' })
  endDate: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Feeling ill' })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1, description: 'user leave id from /user-leave' })
  userLeavePolicyId: number; // user ko ho, kasto leave lina lageko, tyo leave kun country/fy ko ho vanera
}
