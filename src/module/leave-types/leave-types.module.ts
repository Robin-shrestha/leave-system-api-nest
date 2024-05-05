import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveType } from './entities/leave-type.entity';
import { LeaveTypesSeed } from './seed/leave-types.seed';
import { LeaveTypesService } from './leave-types.service';
import { LeaveTypesController } from './leave-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveType])],
  controllers: [LeaveTypesController],
  providers: [LeaveTypesService, LeaveTypesSeed],
  exports: [LeaveTypesService, LeaveTypesSeed],
})
export class LeaveTypesModule {}
