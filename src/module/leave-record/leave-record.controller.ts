import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { Role } from 'src/types/enums';
import { Roles } from '../auth/decorators/Roles.decorator';
import { LeaveRecordService } from './leave-record.service';
import { LeaveStatus } from './entities/leave-record.entity';
import { CreateLeaveRecordDto } from './dto/create-leave-record.dto';
import { UpdateLeaveRecordDto } from './dto/update-leave-record.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Leave Record')
@Controller('leave-record')
export class LeaveRecordController {
  constructor(private readonly leaveRecordService: LeaveRecordService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createLeaveRecordDto: CreateLeaveRecordDto) {
    return this.leaveRecordService.create(createLeaveRecordDto);
  }

  @Get()
  @Roles(Role.ADMIN) // ? umm if anyone can view anyone elses leaves request then i guess the role can be USER
  findAll() {
    return this.leaveRecordService.findAll();
  }

  @Get('user/:userId')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Get all leaves of a user' })
  findLeavesByUserId(@Param('userId') userId: string) {
    throw new Error('Not Implemented!');
  }

  @Get('manager/:managerId')
  @Roles(Role.MANAGER)
  @ApiOperation({
    summary: 'Get all leave records managed by a specific manager',
  })
  findLeavesByManager(@Param('managerId') managerId: string) {
    throw new Error('Not Implemented!');
  }

  @Get(':id')
  @Roles(Role.USER)
  findOne(@Param('id') id: string) {
    return this.leaveRecordService.findOne(+id, {
      userLeave: { leavePolicy: true },
    });
  }

  // only by managers or admin
  @Patch(':id/approve')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Approve Leave' })
  approveLeave(@Param('id') id: string) {
    return this.leaveRecordService.updateStatus(+id, LeaveStatus.APPROVED);
  }

  // only by managers or admin
  @Patch(':id/reject')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Reject Leave' })
  rejectLeave(@Param('id') id: string) {
    return this.leaveRecordService.updateStatus(+id, LeaveStatus.REJECTED);
  }

  @Put(':id')
  @Roles(Role.USER)
  update(
    @Param('id') id: string,
    @Body() updateLeaveRecordDto: UpdateLeaveRecordDto,
  ) {
    return this.leaveRecordService.update(+id, updateLeaveRecordDto);
  }

  @Delete(':id')
  @Roles(Role.USER)
  remove(@Param('id') id: string) {
    return this.leaveRecordService.remove(+id);
  }
}
