import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateHolidayDto {
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  @IsNotEmpty()
  fiscalYearId: number;
}
