import { Module } from '@nestjs/common';
import { LeaveRecordService } from './leave-record.service';
import { LeaveRecordController } from './leave-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRecord } from './entities/leave-record.entity';
import { UserLeaveModule } from '../user-leave/user-leave.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRecord]),
    UserLeaveModule,
    UserModule,
  ],
  controllers: [LeaveRecordController],
  providers: [LeaveRecordService],
  exports: [LeaveRecordService],
})
export class LeaveRecordModule {}
