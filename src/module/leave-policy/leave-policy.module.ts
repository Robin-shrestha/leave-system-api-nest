import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeavePolicySeed } from './seed/leave-policy.seed';
import { LeavePolicyService } from './leave-policy.service';
import { LeavePolicy } from './entities/leave-policy.entity';
import { LeavePolicyController } from './leave-policy.controller';
import { FiscalYearModule } from '../fiscal-year/fiscal-year.module';
import { LeaveTypesModule } from '../leave-types/leave-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeavePolicy]),
    FiscalYearModule,
    LeaveTypesModule,
  ],
  controllers: [LeavePolicyController],
  providers: [LeavePolicyService, LeavePolicySeed],
  exports: [LeavePolicyService, LeavePolicySeed],
})
export class LeavePolicyModule {}
