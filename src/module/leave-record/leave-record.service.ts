import { RejectLeaveRecordDto } from './dto/reject-leave-record.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLeaveRecordDto } from './dto/create-leave-record.dto';
import { UpdateLeaveRecordDto } from './dto/update-leave-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaveRecord, LeaveStatus } from './entities/leave-record.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { calculateDaysInRange } from 'src/utils';
import { UserLeave } from '../user-leave/entities/user-leave.entity';
import { JWTUser } from '../auth/types/profile.type';
import { Role } from 'src/types/enums';
import { Users } from '../user/entities/users.entity';

@Injectable()
export class LeaveRecordService {
  constructor(
    @InjectRepository(LeaveRecord)
    private readonly leaveRecordRepository: Repository<LeaveRecord>,
    @InjectRepository(UserLeave)
    private readonly userLeaveRepository: Repository<UserLeave>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  private async leavesTakenForUserLeavePolicy(userLeavePolicyId: number) {
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

  /**
   * Validate wether user has enough leaves
   * @description if the user does not have enough leaves throws error
   * @returns boolean
   */
  private async validateLeaveCount(
    startDate: string,
    endDate: string,
    userLeavePolicy: UserLeave,
  ) {
    const appliedLeaveCount = calculateDaysInRange(startDate, endDate);
    const totalLeaveForUser =
      userLeavePolicy.additionalDays + userLeavePolicy.leavePolicy.count;

    const leavesTaken = await this.leavesTakenForUserLeavePolicy(
      userLeavePolicy.id,
    );

    if (appliedLeaveCount > totalLeaveForUser - Number(leavesTaken)) {
      throw new BadRequestException('Not enough available Leaves!');
    }

    return true;
  }

  /**
   * @description create a leave record that is in pending state
   */
  async create(createLeaveRecordDto: CreateLeaveRecordDto, user: JWTUser) {
    const { id, role } = user;
    const { userLeavePolicyId, ...rest } = createLeaveRecordDto;

    const userLeavePolicy = await this.userLeaveRepository.findOneOrFail({
      where: { id: userLeavePolicyId },
      relations: { user: true, leavePolicy: true },
    });

    // ? do not allow others to apply leave on others behalf unless they are admin
    if (id !== userLeavePolicy.id && role !== Role.ADMIN) {
      throw new BadRequestException(
        'You can not apply for leave on others behalf',
      );
    }

    await this.validateLeaveCount(
      rest.startDate,
      rest.endDate,
      userLeavePolicy,
    );

    const leaveRecord = this.leaveRecordRepository.create({
      status: LeaveStatus.PENDING,
      ...rest,
      userLeave: userLeavePolicy,
      user: userLeavePolicy.user,
    });

    await this.leaveRecordRepository.insert(leaveRecord);
  }

  findAll(options?: FindManyOptions<LeaveRecord>) {
    return this.leaveRecordRepository.find({
      select: { user: { username: true, email: true } },
      relations: {
        userLeave: { leavePolicy: { leaveType: true } },
        user: true,
      },
      ...options,
    });
  }

  findAllLeaveRecordOfUser(userId: number) {
    return this.leaveRecordRepository.find({
      where: {
        user: { id: userId },
      },
    });
  }

  async findLeaveRecordsByManager(managerId: number) {
    const manager = await this.userRepository.findOneOrFail({
      where: { id: managerId },
    });

    return this.leaveRecordRepository.find({
      where: { user: { manager } },
      relations: { user: true },
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
  async update(
    id: number,
    updateLeaveRecordDto: UpdateLeaveRecordDto,
    user: JWTUser,
  ) {
    const { id: profileId, role } = user;
    const { userLeavePolicyId, ...rest } = updateLeaveRecordDto;

    const leaveRecord = await this.leaveRecordRepository.findOneOrFail({
      where: { id },
      relations: {
        userLeave: true,
        user: true,
      },
    });

    // ? do not allow others to apply leave on others behalf unless they are admin
    if (profileId !== leaveRecord.user.id && role !== Role.ADMIN) {
      throw new BadRequestException(
        'You can not apply for leave on others behalf',
      );
    }

    if (userLeavePolicyId) {
      leaveRecord.userLeave = await this.userLeaveRepository.findOneOrFail({
        where: { id: userLeavePolicyId },
      });
    }

    await this.validateLeaveCount(
      rest.startDate,
      rest.endDate,
      leaveRecord.userLeave,
    );

    return this.leaveRecordRepository.save({
      ...leaveRecord,
      ...rest,
    });
  }

  private async validateStatusUpdate(
    leaveId: number,
    user: JWTUser,
  ): Promise<LeaveRecord> {
    const leaveRecord = await this.leaveRecordRepository.findOneOrFail({
      where: { id: leaveId },
      relations: { user: { manager: true } },
    });

    if (leaveRecord.status !== LeaveStatus.PENDING) {
      throw new BadRequestException(
        `the leave has already been ${leaveRecord.status}`,
      );
    }

    const { id: profileId, role } = user;

    if (profileId !== leaveRecord.user.manager.id && role !== Role.ADMIN) {
      throw new BadRequestException(
        'You can not approve the status of this leave request',
      );
    }
    return leaveRecord;
  }

  async rejectLeave(
    leaveId: number,
    rejectLeaveRecordDto: RejectLeaveRecordDto,
    user: JWTUser,
  ) {
    const validatedRecord = await this.validateStatusUpdate(leaveId, user);

    return this.leaveRecordRepository.save({
      ...validatedRecord,
      status: LeaveStatus.REJECTED,
      rejectReason: rejectLeaveRecordDto.rejectReason,
    });
  }

  async approveLeave(leaveId: number, user: JWTUser) {
    const validatedRecord = await this.validateStatusUpdate(leaveId, user);

    return this.leaveRecordRepository.save({
      ...validatedRecord,
      status: LeaveStatus.APPROVED,
    });
  }

  async remove(id: number) {
    await this.leaveRecordRepository.delete(id);
  }
}
