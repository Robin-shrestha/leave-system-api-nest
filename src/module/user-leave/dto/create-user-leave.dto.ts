import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateUserLeaveDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  leavePolicyId: number;

  @IsNumber()
  @IsOptional()
  additionalDays: number;
}
