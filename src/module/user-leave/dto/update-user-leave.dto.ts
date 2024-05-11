import { PartialType } from '@nestjs/mapped-types';
import { CreateUserLeaveDto } from './create-user-leave.dto';

export class UpdateUserLeaveDto extends PartialType(CreateUserLeaveDto) {}
