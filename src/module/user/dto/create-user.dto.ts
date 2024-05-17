import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  Length,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsDateString,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator';
import { validationErrors } from 'src/constants/validationMessages';
import { Gender } from 'src/types/enums';
import { interpolate } from 'src/utils';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ default: 'rsrestha' })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ default: 'rsrestha@gmail.com' })
  email: string;

  @ApiProperty({ default: '1992-10-10' })
  @IsNotEmpty()
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
  @IsNotEmpty()
  address: string;

  @ApiProperty({ default: 'SE' })
  @IsNotEmpty()
  designation: string;

  @ApiProperty({ default: '9998884445' })
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({
    default:
      'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
  })
  @IsOptional()
  profilePicture?: string;

  @ApiProperty({ default: [1, 2, 3] })
  @IsArray()
  @ArrayNotEmpty()
  roleIds: number[];

  @ApiProperty({ default: 'NP' })
  @Length(2, 2)
  @IsNotEmpty()
  country: string;

  @ApiProperty({ default: Gender.MALE })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}
