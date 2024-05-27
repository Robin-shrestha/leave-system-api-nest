import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RejectLeaveRecordDto {
  @IsString()
  @ApiProperty({ example: 'Reason of leave' })
  rejectReason: string;
}
