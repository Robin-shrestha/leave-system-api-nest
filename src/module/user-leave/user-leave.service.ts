import { LeavePolicyService } from './../leave-policy/leave-policy.service';
import { Injectable } from '@nestjs/common';
import { CreateUserLeaveDto } from './dto/create-user-leave.dto';
import { UpdateUserLeaveDto } from './dto/update-user-leave.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLeave } from './entities/user-leave.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class UserLeaveService {
  constructor(
    @InjectRepository(UserLeave)
    private userLeaveRepository: Repository<UserLeave>,
    private readonly userServices: UserService,
    private readonly leavePolicyService: LeavePolicyService,
  ) {}

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

  findAll() {
    return this.userLeaveRepository.find({
      relations: { leavePolicy: true, user: true },
    });
  }

  findOne(id: number) {
    return this.userLeaveRepository.findOneOrFail({
      where: { id },

      relations: { leavePolicy: true, user: true },
    });
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
}
