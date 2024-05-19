import { AccessControlService } from './../auth/accessControl.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Users } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedResult, PaginationDto } from 'src/utils';
import { CountryService } from '../country/country.service';
import { Role } from 'src/types/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly accAccessControlService: AccessControlService,
    private readonly countryServices: CountryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { country, managerId, ...rest } = createUserDto;

    const countryEntity = await this.countryServices.findByCountryCode(country);

    const userEntity = this.userRepository.create({
      ...rest,
      country: countryEntity,
    });

    if (managerId) {
      const manager = await this.userRepository.findOneByOrFail({
        id: managerId,
      });

      // checking ig the provided manager has proper roles
      if (
        !this.accAccessControlService.isAuthorized({
          currentRole: manager.role,
          requiredRole: Role.MANAGER,
        })
      ) {
        throw new BadRequestException(
          'The provided user for manager is not a manager',
        );
      }
      userEntity.manager = manager;
    }

    return this.userRepository.save(userEntity);
  }

  async findAll(paginationDto: PaginationDto = {}) {
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
