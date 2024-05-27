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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('User Leave')
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
  @ApiOperation({ summary: 'Get all User leave Policies' })
  findAll() {
    return this.userLeaveService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get User leave Policies by user leave policy id' })
  findOne(@Param('id') id: string) {
    return this.userLeaveService.findOne(+id);
  }

  @Get('user/:userId')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Get User leave Policies of a specific user' })
  findAllUserLeavePolicyByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userLeaveService.findAllLeavePolicyOfUser(userId);
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
