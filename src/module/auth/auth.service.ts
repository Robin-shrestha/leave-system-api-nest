import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { Role } from './decorators/Roles.decorator';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signIn(username: string, _password: string) {
    const user = await this.userService.findOneByUsername(username);

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      roles: user.id % 2 === 0 ? [Role.USER] : [Role.USER, Role.ADMiN],
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      }),
    };
  }
}
