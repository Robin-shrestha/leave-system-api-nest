import { IsNotEmpty, Length, IsUppercase } from 'class-validator';

export class CreateCountryDto {
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  @IsUppercase()
  @Length(2, 2)
  countryCode: string;
}
