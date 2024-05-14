import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Gender } from 'src/types/enums';

export class CreateLeaveTypeDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(Gender)
  @IsOptional()
  affectedGender?: Gender;
}
