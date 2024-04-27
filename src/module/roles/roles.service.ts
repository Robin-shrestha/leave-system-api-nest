import { Repository } from 'typeorm';
import { RolesDto } from './dto/roles.dto';
import { Roles } from './entity/roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { BaseServiceOptions } from 'src/types/serviceOptions.types';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
  ) {}

  findAll(options?: BaseServiceOptions) {
    return this.rolesRepository.find({
      withDeleted: options?.showDeleted,
    });
  }

  findOne(id: number) {
    return this.rolesRepository.findOneByOrFail({ id });
  }

  async findRoleEntityByRoleName(roleName: string) {
    return this.rolesRepository.findOneByOrFail({
      role: roleName,
    });
  }
  async findRoleEntitiesByRoleNames(roleNames: string[]) {
    const roleEntitiesMap = roleNames.map((roleName) =>
      this.findRoleEntityByRoleName(roleName),
    );

    return await Promise.all(roleEntitiesMap);
  }

  create(role: RolesDto) {
    const roles = this.rolesRepository.create(role);

    return this.rolesRepository.save(roles);
  }
}
