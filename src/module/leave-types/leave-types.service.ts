import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaveType } from './entities/leave-type.entity';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';

@Injectable()
export class LeaveTypesService {
  constructor(
    @InjectRepository(LeaveType)
    private leavesRepository: Repository<LeaveType>,
  ) {}

  async create(createLeaveTypeDto: CreateLeaveTypeDto) {
    const leaveEntity = this.leavesRepository.create(createLeaveTypeDto);
    await this.leavesRepository.insert(leaveEntity);
  }

  findAll() {
    return this.leavesRepository.find();
  }

  findOne(id: number) {
    return this.leavesRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateLeaveTypeDto: UpdateLeaveTypeDto) {
    const leaveEntity = await this.findOne(id);

    return this.leavesRepository.save({
      ...leaveEntity,
      ...updateLeaveTypeDto,
    });
  }

  async remove(id: number) {
    await this.leavesRepository.softDelete(id);
  }
}
