import { IsNotEmpty } from 'class-validator';

export class CreateRolesDto {
  @IsNotEmpty()
  role: string;
}
