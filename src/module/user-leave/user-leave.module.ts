import { Module } from '@nestjs/common';
import { UserLeaveService } from './user-leave.service';
import { UserLeaveController } from './user-leave.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLeave } from './entities/user-leave.entity';
import { LeavePolicyModule } from '../leave-policy/leave-policy.module';
import { UserModule } from '../user/user.module';
import { LeaveRecordModule } from '../leave-record/leave-record.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLeave]),
    LeavePolicyModule,
    UserModule,
    LeaveRecordModule,
  ],
  controllers: [UserLeaveController],
  providers: [UserLeaveService],
  exports: [UserLeaveService],
})
export class UserLeaveModule {}
