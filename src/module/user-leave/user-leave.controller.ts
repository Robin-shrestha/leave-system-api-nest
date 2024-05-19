import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { Role } from 'src/types/enums';
import { UserLeaveService } from './user-leave.service';
import { Roles } from '../auth/decorators/Roles.decorator';
import { CreateUserLeaveDto } from './dto/create-user-leave.dto';
import { UpdateUserLeaveDto } from './dto/update-user-leave.dto';

@Controller('user-leave')
export class UserLeaveController {
  constructor(private readonly userLeaveService: UserLeaveService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserLeaveDto: CreateUserLeaveDto) {
    return this.userLeaveService.create(createUserLeaveDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.userLeaveService.findAll();
  }

  @Get('user/:userId')
  @Roles(Role.USER)
  findAllUserLeavePolicyByUser(@Param('userId', ParseIntPipe) userId: string) {
    throw new Error('Not implemented');
  }

  @Get('user/:userId/:id')
  @Roles(Role.USER)
  findOneUserLeavePolicyByUser(
    @Param('userId', ParseIntPipe) userId: string,
    @Param('id', ParseIntPipe) id: string,
  ) {
    throw new Error('Not implemented');
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.userLeaveService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateUserLeaveDto: UpdateUserLeaveDto,
  ) {
    return this.userLeaveService.update(+id, updateUserLeaveDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.userLeaveService.remove(+id);
  }
}
