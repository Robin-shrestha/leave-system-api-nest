import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateUserLeaveDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'id of the user. From /users' })
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description:
      'id of a specific leave policy to be applied to the user. From /leave-policy',
  })
  leavePolicyId: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    example: null,
    description:
      'any additional days to be give for that user in that particular leave policy',
  })
  additionalDays?: number;
}
