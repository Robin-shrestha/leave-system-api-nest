import { Injectable, Logger } from '@nestjs/common';

import { LeavePolicyService } from './../leave-policy.service';
import { CreateLeavePolicyDto } from '../dto/create-leave-policy.dto';
import { LeaveTypesService } from 'src/module/leave-types/leave-types.service';
import { FiscalYearService } from 'src/module/fiscal-year/fiscal-year.service';

const leavePolicies: Omit<
  CreateLeavePolicyDto,
  'fiscalYearId' | 'leaveTypeId'
>[] = [
  {
    count: 10,
    cashable: false,
    maxTransferable: 2,
  },
];

@Injectable()
export class LeavePolicySeed {
  private readonly logger = new Logger(LeavePolicySeed.name);

  constructor(
    private readonly leavePolicyService: LeavePolicyService,
    private readonly leaveTypesService: LeaveTypesService,
    private readonly fiscalYearService: FiscalYearService,
  ) {}

  async seedLeavePolicy() {
    const existingLeavePolicies = await this.leavePolicyService.findAll();

    if (!existingLeavePolicies.length) {
      const fiscalYear = (await this.fiscalYearService.findAll())[0];

      const leaveType = (await this.leaveTypesService.findAll())[0];

      await Promise.all(
        leavePolicies.map((leavePolicy) =>
          this.leavePolicyService.create({
            ...leavePolicy,
            fiscalYearId: fiscalYear.id,
            leaveTypeId: leaveType.id,
          }),
        ),
      );

      this.logger.log(`Seeded leave policies`);
    }
  }
}
