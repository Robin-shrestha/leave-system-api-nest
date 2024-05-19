import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  Length,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
  IsNumber,
} from 'class-validator';

import { interpolate } from 'src/utils';
import { Gender, Role } from 'src/types/enums';
import { validationErrors } from 'src/constants/validationMessages';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ default: 'rsrestha' })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ default: 'rsrestha@gmail.com' })
  email: string;

  @ApiProperty({ default: 'NP' })
  @Length(2, 2)
  @IsNotEmpty()
  country: string;

  @ApiProperty({ default: [1, 2, 3] })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ default: '1992-10-10' })
  @IsDateString(
    {},
    {
      message: interpolate(validationErrors.DATE_FORMAT, {
        key: 'dateOfBirth',
      }),
    },
  )
  dateOfBirth: string;

  @ApiProperty({ default: 'Kathmandu' })
  @IsOptional()
  address: string;

  @ApiProperty({ default: 1 })
  @IsOptional()
  @IsNumber()
  managerId?: number;

  @ApiProperty({ default: 'SE' })
  @IsOptional()
  designation: string;

  @ApiProperty({ default: '9998884445' })
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({
    default:
      'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
  })
  @IsOptional()
  profilePicture?: string;

  @ApiProperty({ default: Gender.MALE })
  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;
}
