import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateLeavePolicyDto {
  @IsNotEmpty()
  @ApiProperty({ example: 2, description: 'fiscal year id from /fiscal-year' })
  'fiscalYearId': number;

  @IsNotEmpty()
  @ApiProperty({ example: 2, description: 'leave type id from /leave-type' })
  'leaveTypeId': number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 20 })
  'count': number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 12 })
  'maxTransferable'?: number;

  @IsOptional()
  @ApiProperty({ example: true })
  'cashable'?: boolean;
}
