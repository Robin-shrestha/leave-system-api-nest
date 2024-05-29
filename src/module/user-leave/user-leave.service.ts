import { LeavePolicyService } from './../leave-policy/leave-policy.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserLeaveDto } from './dto/create-user-leave.dto';
import { UpdateUserLeaveDto } from './dto/update-user-leave.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLeave } from './entities/user-leave.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { LeaveTransferDTO } from './dto/leave-transfer-dto';
import { LeaveRecordService } from '../leave-record/leave-record.service';

@Injectable()
export class UserLeaveService {
  constructor(
    @InjectRepository(UserLeave)
    private userLeaveRepository: Repository<UserLeave>,
    private readonly userServices: UserService,
    private readonly leavePolicyService: LeavePolicyService,
    private readonly leaveRecordService: LeaveRecordService,
  ) {}

  private findAllQueryBuilder() {
    return this.userLeaveRepository
      .createQueryBuilder('ul')
      .select([
        'ul.id as userLeaveId',
        'u.id as userId',
        'u.username as username',
        'lt.id AS leaveTypeId',
        'lt.type AS leaveType',
        'ul.additional_days + lp.count AS totalLeaves',
        'COALESCE(SUM(lr.count), 0) AS leavesTaken',
      ])
      .innerJoin('ul.user', 'u')
      .innerJoin('ul.leavePolicy', 'lp')
      .innerJoin('lp.leaveType', 'lt')
      .leftJoin(
        'ul.leaveRecords',
        'lr',
        'lr.userLeave = ul.id and lr.status != "rejected"',
      )
      .groupBy('ul.id, u.id, lt.id');
  }

  async create(createUserLeaveDto: CreateUserLeaveDto) {
    const { userId, leavePolicyId, ...rest } = createUserLeaveDto;

    const leavePolicy = await this.leavePolicyService.findOne(leavePolicyId);
    const user = await this.userServices.findOne(userId);

    const userLeave = this.userLeaveRepository.create({
      ...rest,
      leavePolicy,
      user,
    });

    await this.userLeaveRepository.insert(userLeave);
  }

  async findAll() {
    const res = await this.findAllQueryBuilder()
      .orderBy('ul.id', 'ASC')
      .getRawMany();

    return res;
  }

  async findOne(id: number) {
    return this.userLeaveRepository.findOneOrFail({
      where: { id },
      select: {
        leavePolicy: {
          count: true,
          id: true,
          cashable: true,
          leaveType: { type: true, id: true },
        },
        user: {
          id: true,
          email: true,
          username: true,
          leaveRecord: true,
        },
      },
      relations: {
        leavePolicy: { leaveType: true },
        user: { leaveRecord: true },
      },
    });
  }

  async findAllLeavePolicyOfUser(userId: number) {
    const res = await this.findAllQueryBuilder()
      .orderBy('ul.id', 'ASC')
      .andWhere('u.id=:userId', { userId })
      .getRawMany();
    return res;
  }

  async update(id: number, updateUserLeaveDto: UpdateUserLeaveDto) {
    const userLeave = await this.userLeaveRepository.findOneByOrFail({
      id,
    });
    const { userId, leavePolicyId, ...rest } = updateUserLeaveDto;

    if (userId) {
      userLeave.user = await this.userServices.findOne(userId);
    }
    if (leavePolicyId) {
      userLeave.leavePolicy =
        await this.leavePolicyService.findOne(leavePolicyId);
    }

    return this.userLeaveRepository.save({
      ...userLeave,
      ...rest,
    });
  }

  async remove(id: number) {
    await this.userLeaveRepository.softDelete(id);
  }

  async transferLeave(leaveTransferDto: LeaveTransferDTO) {
    const { currentUserLeavePolicyId, nextUserLeavePolicyId } =
      leaveTransferDto;

    const currentUserLeavePolicy = await this.userLeaveRepository.findOneOrFail(
      {
        where: { id: currentUserLeavePolicyId },
        relations: {
          leavePolicy: { fiscalYear: true, leaveType: true },
        },
      },
    );

    // check if transferrable
    if (!currentUserLeavePolicy.leavePolicy.maxTransferable) {
      throw new BadRequestException('this type of leave is not transferrable');
    }

    const targetUserLeavePolicy = await this.userLeaveRepository.findOneOrFail({
      where: { id: nextUserLeavePolicyId },
      relations: {
        leavePolicy: { leaveType: true, fiscalYear: true },
      },
    });

    // checks if new policy takes place is after current
    if (
      new Date(currentUserLeavePolicy.leavePolicy.fiscalYear.endDate) >
      new Date(targetUserLeavePolicy.leavePolicy.fiscalYear.startDate)
    ) {
      throw new BadRequestException('cant transfer leave to past policies');
    }

    const leavesTaken =
      await this.leaveRecordService.leavesTakenForUserLeavePolicy(
        currentUserLeavePolicyId,
      );

    const maxTransferrableLeaves =
      currentUserLeavePolicy.leavePolicy.maxTransferable;

    const transferrableLeaveCount = Math.min(
      maxTransferrableLeaves,
      currentUserLeavePolicy.additionalDays +
        currentUserLeavePolicy.leavePolicy.count -
        leavesTaken,
    );

    await this.userLeaveRepository.save({
      ...targetUserLeavePolicy,
      additionalDays:
        targetUserLeavePolicy.additionalDays + transferrableLeaveCount,
    });
  }
}
