import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsUppercase } from 'class-validator';

export class CreateCountryDto {
  @IsNotEmpty()
  @ApiProperty({ default: 'Canada' })
  countryName: string;

  @IsNotEmpty()
  @IsUppercase()
  @Length(2, 2)
  @ApiProperty({ default: 'CN' })
  countryCode: string;
}
