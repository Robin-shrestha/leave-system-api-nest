import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateHolidayDto {
  @IsNotEmpty()
  @ApiProperty({ default: 'Holi' })
  name: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ default: '2024-10-10' })
  date: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ default: '3' })
  fiscalYearId: number;
}
