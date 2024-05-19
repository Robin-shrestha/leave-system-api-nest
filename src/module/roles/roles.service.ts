import { Repository } from 'typeorm';
import { CreateRolesDto } from './dto/roles.dto';
import { Roles } from './entity/roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
  ) {}

  findAll() {
    return this.rolesRepository.find({});
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

  async create(role: CreateRolesDto) {
    const roles = this.rolesRepository.create(role);

    await this.rolesRepository.insert(roles);
  }
}
