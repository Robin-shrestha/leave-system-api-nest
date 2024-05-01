import {
  IsEmail,
  Length,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsDateString,
  ArrayNotEmpty,
} from 'class-validator';
import { validationErrors } from 'src/constants/validationMessages';
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
  roles: number[];

  @Length(2, 2)
  @IsNotEmpty()
  country: string;
}
