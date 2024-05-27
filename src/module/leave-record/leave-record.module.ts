import { Module } from '@nestjs/common';
import { LeaveRecordService } from './leave-record.service';
import { LeaveRecordController } from './leave-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRecord } from './entities/leave-record.entity';
import { UserLeave } from '../user-leave/entities/user-leave.entity';
import { Users } from '../user/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRecord, UserLeave, Users])],
  controllers: [LeaveRecordController],
  providers: [LeaveRecordService],
  exports: [LeaveRecordService],
})
export class LeaveRecordModule {}
