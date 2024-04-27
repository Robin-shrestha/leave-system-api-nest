import { Repository } from 'typeorm';
import { Roles } from '../entity/roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

const defaultRoles = ['User', 'Admin', 'Manager'];

@Injectable()
export class RoleSeeds {
  private readonly logger = new Logger(RoleSeeds.name);
  constructor(
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
  ) {}

  async seedRoles() {
    const roles = await this.rolesRepository.find();
    if (!roles.length) {
      const rolesEntities = defaultRoles.map((role) =>
        this.rolesRepository.create({ role }),
      );
      await this.rolesRepository.save(rolesEntities);
    }
    this.logger.log(`Roles Seeded: ${defaultRoles.join(',')}`);
  }
}
