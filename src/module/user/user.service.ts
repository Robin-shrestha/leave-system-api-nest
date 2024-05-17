import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Users } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from '../roles/roles.service';
import { PaginatedResult, PaginationDto } from 'src/utils';
import { CountryService } from '../country/country.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly rolesServices: RolesService,
    private readonly countryServices: CountryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { roleIds, country, ...rest } = createUserDto;

    const countryEntity = await this.countryServices.findByCountryCode(country);

    const rolesEntity = await Promise.all(
      roleIds.map((roleId) => this.rolesServices.findOne(roleId)),
    );

    const userEntity = this.userRepository.create({
      ...rest,
      roles: rolesEntity,
      country: countryEntity,
    });

    return this.userRepository.save(userEntity);
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;
    const [res, total] = await this.userRepository.findAndCount({
      relations: {
        country: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return new PaginatedResult(res, {
      page,
      total,
      limit,
    });
  }

  async findOne(id: number) {
    return this.userRepository.findOneOrFail({
      where: { id },
      relations: {
        country: true,
        roles: true,
      },
      select: {
        roles: { role: true, id: true },
      },
    });
  }

  async findOneByUsername(username: string) {
    if (!username) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.findOneByOrFail({
      username,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user ${updateUserDto}`;
  }

  async remove(id: number) {
    const userToBeDeleted = await this.findOne(id);
    await this.userRepository.softRemove(userToBeDeleted);
  }
}
