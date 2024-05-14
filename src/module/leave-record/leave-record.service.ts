import { UserService } from './../user/user.service';
import { UserLeaveService } from './../user-leave/user-leave.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLeaveRecordDto } from './dto/create-leave-record.dto';
import { UpdateLeaveRecordDto } from './dto/update-leave-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaveRecord, LeaveStatus } from './entities/leave-record.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { calculateDaysInRange } from 'src/utils';

@Injectable()
export class LeaveRecordService {
  constructor(
    @InjectRepository(LeaveRecord)
    private leaveRecordRepository: Repository<LeaveRecord>,
    private readonly userLeaveService: UserLeaveService,
    private readonly userService: UserService,
  ) {}

  /**
   * @description create a leave record that is in pending state
   * TODO can also check if the date range being applied already exists
   */
  async create(createLeaveRecordDto: CreateLeaveRecordDto) {
    const { userLeavePolicyId, ...rest } = createLeaveRecordDto;

    const leaveCount = calculateDaysInRange(rest.startDate, rest.endDate);

    const userLeave = await this.userLeaveService.findOne(userLeavePolicyId);

    const leavesTaken = this._leavesTakenForUserLeavePolicy(userLeave.id);

    const totalLeaveForUser =
      userLeave.additionalDays + userLeave.leavePolicy.count;

    if (leaveCount > totalLeaveForUser - Number(leavesTaken)) {
      throw new BadRequestException('Not enough available Leaves!');
    }

    const leaveRecord = this.leaveRecordRepository.create({
      status: LeaveStatus.PENDING,
      ...rest,
      userLeave,
    });

    await this.leaveRecordRepository.insert(leaveRecord);
  }

  private async _leavesTakenForUserLeavePolicy(userLeavePolicyId: number) {
    const leavesTaken =
      (
        await this.leaveRecordRepository
          .createQueryBuilder('leaveRecord')
          .select('SUM(leaveRecord.count) as usedLeaves')
          .where('leaveRecord.user_leave_policy = :userLeaveId', {
            userLeaveId: userLeavePolicyId,
          })
          .getRawOne<{ usedLeaves: number | null }>()
      ).usedLeaves || 0;

    return Number(leavesTaken);
  }

  findAll(options?: FindManyOptions<LeaveRecord>) {
    return this.leaveRecordRepository.find({
      relations: { userLeave: { leavePolicy: true, user: true } },
      ...options,
    });
  }

  findOne(id: number, relations?: FindOneOptions<LeaveRecord>['relations']) {
    return this.leaveRecordRepository.findOneOrFail({
      where: { id },
      relations,
    });
  }

  /**
   * to update
   * if record is of current user they can update the start/end date and desc
   */
  async update(id: number, updateLeaveRecordDto: UpdateLeaveRecordDto) {
    const { userLeavePolicyId, ...rest } = updateLeaveRecordDto;
    const leaveRecord = await this.findOne(id, {
      userLeave: { leavePolicy: true },
    });

    const leaveCount = calculateDaysInRange(
      rest.startDate || leaveRecord.startDate,
      rest.endDate || leaveRecord.endDate,
    );
    const leavesTaken = await this._leavesTakenForUserLeavePolicy(
      leaveRecord.userLeave.id,
    );

    const totalLeaveForUser =
      leaveRecord.userLeave.additionalDays +
      leaveRecord.userLeave.leavePolicy.count;

    if (leaveCount > totalLeaveForUser - Number(leavesTaken)) {
      throw new BadRequestException('Not enough available Leaves!');
    }

    if (userLeavePolicyId) {
      leaveRecord.userLeave =
        await this.userLeaveService.findOne(userLeavePolicyId);
    }

    return this.leaveRecordRepository.save({
      ...leaveRecord,
      ...rest,
    });
  }

  async updateStatus(id: number, status: LeaveStatus) {
    const leaveRecord = await this.findOne(id);

    return this.leaveRecordRepository.save({
      ...leaveRecord,
      status: status,
    });
  }

  async remove(id: number) {
    await this.leaveRecordRepository.delete(id);
  }
}
