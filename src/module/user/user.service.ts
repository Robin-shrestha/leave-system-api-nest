import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from '../roles/roles.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseServiceOptions } from 'src/types/serviceOptions.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly rolesServices: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { roles, ...rest } = createUserDto;

    const rolesEntity = await Promise.all(
      roles.map((roleId) => this.rolesServices.findOne(roleId)),
    );

    const userEntity = this.userRepository.create({
      ...rest,
      roles: rolesEntity,
    });

    return this.userRepository.save(userEntity);
  }

  findAll(options?: BaseServiceOptions) {
    return this.userRepository.find({
      withDeleted: options?.showDeleted,
    });
  }

  async findOne(id: number) {
    return this.userRepository.findOneOrFail({
      where: { id },
      relations: {
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
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const userToBeDeleted = await this.findOne(id);
    console.log(
      '🚀 ~ UserService ~ remove ~ userToBeDeleted:',
      userToBeDeleted,
    );
    const res = await this.userRepository.softRemove(userToBeDeleted);
    console.log('🚀 ~ UserService ~ remove ~ res:', res);
  }
}
