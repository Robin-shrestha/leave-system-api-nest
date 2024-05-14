import { CreateLeaveTypeDto } from 'src/module/leave-types/dto/create-leave-type.dto';
import { LeaveTypesService } from '../leave-types.service';
import { Injectable, Logger } from '@nestjs/common';
import { Gender } from 'src/types/enums';

const leaveTypes: CreateLeaveTypeDto[] = [
  {
    type: 'Discretionary',
    description: 'Discretionary common leave',
  },
  {
    type: 'Sick Leave',
    description: 'Leave when sick',
  },
  {
    type: 'Mensuration leave',
    description: 'only available for the ladies',
    affectedGender: Gender.FEMALE,
  },
  {
    type: 'Compensatory Leave',
  },
];

@Injectable()
export class LeaveTypesSeed {
  private readonly logger = new Logger(LeaveTypesSeed.name);
  constructor(private readonly leaveTypesService: LeaveTypesService) {}

  async seedLeaveTypes() {
    const existingLeaveTypes = await this.leaveTypesService.findAll();

    if (!existingLeaveTypes.length) {
      await Promise.all(
        leaveTypes.map((leaveType) =>
          this.leaveTypesService.create({
            ...leaveType,
          }),
        ),
      );
      this.logger.log(
        `Leave Types seeded: ${leaveTypes.map((leaveType) => leaveType.type).join(', ')}`,
      );
    }
  }
}
