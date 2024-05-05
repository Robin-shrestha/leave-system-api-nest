import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateLeavePolicyDto {
  @IsNotEmpty()
  'fiscalYearId': number;

  @IsNotEmpty()
  'leaveTypeId': number;

  @IsNumber()
  @IsNotEmpty()
  'count': number;

  @IsNumber()
  @IsOptional()
  'maxTransferable'?: number;

  @IsOptional()
  'cashable'?: boolean;
}
