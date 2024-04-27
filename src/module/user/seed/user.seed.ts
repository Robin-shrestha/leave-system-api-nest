import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../user.service';

const defaultUsers: CreateUserDto[] = [
  {
    username: 'Ridiculus Muskrat',
    phone: '(511) 510-0573',
    email: 'ridiculus.ridiculus@outlook.ca',
    address: 'Ap #587-5403 Faucibus Av.',
    roles: [1, 2],
    designation: 'Software Engineer',
    dateOfBirth: '2000-10-10',
  },
  {
    username: 'Adam Hahn',
    phone: '(336) 608-7893',
    email: 'montes.nascetur@hotmail.edu',
    address: 'Ap #812-9878 Convallis Av.',
    roles: [1, 3],
    designation: 'Software Engineer',
    dateOfBirth: '2000-10-11',
  },
  {
    username: 'Sophia Beck',
    phone: '1-765-672-0995',
    email: 'elit@icloud.ca',
    address: 'Ap #300-9086 Imperdiet Avenue',
    roles: [1],
    designation: 'Software Engineer',
    dateOfBirth: '2000-02-10',
  },
  {
    username: 'Cassady Carrillo',
    phone: '(157) 746-6487',
    email: 'convallis@hotmail.couk',
    address: 'Ap #884-4114 Egestas St.',
    roles: [1],
    designation: 'Software Engineer',
    dateOfBirth: '2000-10-21',
  },
  {
    username: 'Burton Ray',
    phone: '1-733-827-3324',
    email: 'faucibus.leo.in@hotmail.org',
    address: '908-9050 At St.',
    roles: [1],
    designation: 'Software Engineer',
    dateOfBirth: '1998-10-16',
  },
];

@Injectable()
export class UserSeed {
  private readonly logger = new Logger(UserSeed.name);

  constructor(private readonly userServices: UserService) {}

  async seedUsers() {
    const users = await this.userServices.findAll();
    if (!users.length) {
      await Promise.all(
        defaultUsers.map((user) => this.userServices.create(user)),
      );
      this.logger.log('Users Seeded');
    }
  }
}
