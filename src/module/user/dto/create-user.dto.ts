import {
  IsEmail,
  Length,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsDateString,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'dateOfBirth be in "YYYY-MM-DD" format' })
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
