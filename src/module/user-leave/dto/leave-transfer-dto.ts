import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class LeaveTransferDTO {
  @ApiProperty({ example: 1, description: 'current user policy' })
  @IsNumber()
  @IsNotEmpty()
  currentUserLeavePolicyId: number;

  @ApiProperty({
    example: 1,
    description: 'user policy where leave need to be transferred',
  })
  @IsNotEmpty()
  @IsNumber()
  nextUserLeavePolicyId: number;
}
