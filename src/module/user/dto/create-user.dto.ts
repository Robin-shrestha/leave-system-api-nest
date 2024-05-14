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
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

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

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  designation: string;

  @IsNotEmpty()
  phone: string;

  @IsOptional()
  profilePicture?: string;

  @IsArray()
  @ArrayNotEmpty()
  roleIds: number[];

  @Length(2, 2)
  @IsNotEmpty()
  country: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}
