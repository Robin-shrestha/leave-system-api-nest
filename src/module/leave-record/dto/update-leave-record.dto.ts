import { OmitType } from '@nestjs/mapped-types';
import { CreateLeaveRecordDto } from './create-leave-record.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateLeaveRecordDto extends OmitType(CreateLeaveRecordDto, [
  'description',
  'userLeavePolicyId',
]) {
  @IsOptional()
  @IsNumber()
  userLeavePolicyId: number;

  @IsOptional()
  description: string;
}
