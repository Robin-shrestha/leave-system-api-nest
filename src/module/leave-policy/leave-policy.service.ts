import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeavePolicy } from './entities/leave-policy.entity';
import { BaseServiceOptions } from 'src/types/serviceOptions.types';
import { CreateLeavePolicyDto } from './dto/create-leave-policy.dto';
import { UpdateLeavePolicyDto } from './dto/update-leave-policy.dto';
import { FiscalYearService } from '../fiscal-year/fiscal-year.service';
import { LeaveTypesService } from './../leave-types/leave-types.service';

@Injectable()
export class LeavePolicyService {
  constructor(
    @InjectRepository(LeavePolicy)
    private readonly leavePolicyRepository: Repository<LeavePolicy>,
    private readonly leaveTypesService: LeaveTypesService,
    private readonly fiscalYearService: FiscalYearService,
  ) {}

  async create(createLeavePolicyDto: CreateLeavePolicyDto) {
    const { fiscalYearId, leaveTypeId, ...rest } = createLeavePolicyDto;
    const leaveTypeEntity = await this.leaveTypesService.findOne(leaveTypeId);

    const fiscalYearEntity = await this.fiscalYearService.findOne(fiscalYearId);

    await this.leavePolicyRepository.insert({
      ...rest,
      leaveType: leaveTypeEntity,
      fiscalYear: fiscalYearEntity,
    });
  }

  findAll(options?: BaseServiceOptions) {
    return this.leavePolicyRepository.find({
      withDeleted: !!options.showDeleted,
      select: {
        fiscalYear: {
          id: true,
          country: { countryCode: true, countryName: true },
          endDate: true,
          startDate: true,
          fiscalYear: true,
        },
        leaveType: {
          affectedGender: true,
          id: true,
          leavePolicy: true,
          type: true,
        },
      },
      relations: {
        fiscalYear: {
          country: true,
        },
        leaveType: true,
      },
    });
  }

  findOne(id: number) {
    return this.leavePolicyRepository.findOneOrFail({
      where: { id },
      select: {
        fiscalYear: {
          id: true,
          country: { countryCode: true, countryName: true },
          endDate: true,
          startDate: true,
          fiscalYear: true,
        },
        leaveType: {
          affectedGender: true,
          id: true,
          leavePolicy: true,
          type: true,
        },
      },
      relations: {
        fiscalYear: {
          country: true,
        },
        leaveType: true,
      },
    });
  }

  async update(id: number, updateLeavePolicyDto: UpdateLeavePolicyDto) {
    const leavePolicy = await this.leavePolicyRepository.findOneByOrFail({
      id,
    });
    const { fiscalYearId, leaveTypeId, ...rest } = updateLeavePolicyDto;

    const fiscalYearEntity = await this.fiscalYearService.findOne(fiscalYearId);

    const leaveTypeEntity = await this.leaveTypesService.findOne(leaveTypeId);

    return this.leavePolicyRepository.save({
      ...leavePolicy,
      ...rest,
      fiscalYear: fiscalYearEntity,
      leaveType: leaveTypeEntity,
    });
  }

  remove(id: number) {
    this.leavePolicyRepository.softDelete(id);
  }
}
