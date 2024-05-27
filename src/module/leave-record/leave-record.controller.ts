import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Role } from 'src/types/enums';
import { JWTUser } from '../auth/types/profile.type';
import { Roles } from '../auth/decorators/Roles.decorator';
import { LeaveRecordService } from './leave-record.service';
import { CreateLeaveRecordDto } from './dto/create-leave-record.dto';
import { UpdateLeaveRecordDto } from './dto/update-leave-record.dto';
import { RejectLeaveRecordDto } from './dto/reject-leave-record.dto';

@ApiBearerAuth()
@ApiTags('Leave Record')
@Controller('leave-record')
export class LeaveRecordController {
  constructor(private readonly leaveRecordService: LeaveRecordService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Body() createLeaveRecordDto: CreateLeaveRecordDto,
    @Req() req: Request,
  ) {
    return this.leaveRecordService.create(
      createLeaveRecordDto,
      req.user as JWTUser,
    );
  }

  @Get()
  @Roles(Role.ADMIN) // ? umm if anyone can view anyone elses leaves request then i guess the role can be USER
  findAll() {
    return this.leaveRecordService.findAll();
  }

  @Get('user/:userId')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Get all leaves of a user' })
  findLeavesByUserId(@Param('userId') userId: number) {
    return this.leaveRecordService.findAllLeaveRecordOfUser(+userId);
  }

  @Get('manager/:managerId')
  @Roles(Role.MANAGER)
  @ApiOperation({
    summary: 'Get all leave records managed by a specific manager',
  })
  findLeavesByManager(@Param('managerId') managerId: string) {
    return this.leaveRecordService.findLeaveRecordsByManager(+managerId);
  }

  @Get(':id')
  @Roles(Role.USER)
  findOne(@Param('id') id: string) {
    return this.leaveRecordService.findOne(+id, {
      userLeave: { leavePolicy: true },
      user: true,
    });
  }

  // only by managers or admin
  @Patch(':id/approve')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Approve Leave' })
  approveLeave(@Param('id') id: string, @Req() req: Request) {
    return this.leaveRecordService.approveLeave(+id, req.user as JWTUser);
  }

  // only by managers or admin
  @Patch(':id/reject')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Reject Leave' })
  rejectLeave(
    @Param('id') id: string,
    @Body() rejectBody: RejectLeaveRecordDto,
    @Req() req: Request,
  ) {
    return this.leaveRecordService.rejectLeave(
      +id,
      rejectBody,
      req.user as JWTUser,
    );
  }

  @Put(':id')
  @Roles(Role.USER)
  update(
    @Param('id') id: string,
    @Body() updateLeaveRecordDto: UpdateLeaveRecordDto,
    @Req() req: Request,
  ) {
    return this.leaveRecordService.update(
      +id,
      updateLeaveRecordDto,
      req.user as JWTUser,
    );
  }

  @Delete(':id')
  @Roles(Role.USER)
  remove(@Param('id') id: string) {
    return this.leaveRecordService.remove(+id);
  }
}
