import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Gender } from 'src/types/enums';

export class CreateLeaveTypeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Sick Leave' })
  type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'To apply do this and that' })
  description?: string;

  @IsEnum(Gender)
  @IsOptional()
  @ApiPropertyOptional({ example: null, enum: Gender })
  affectedGender?: Gender;
}
