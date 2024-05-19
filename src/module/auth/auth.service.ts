import { BadRequestException, Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Role } from 'src/types/enums';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../user/entities/users.entity';
import { RolesService } from '../roles/roles.service';
import { CountryService } from '../country/country.service';
import { GoogleProfile, JWTUser } from './types/profile.type';

const ACCESS_TOKEN_EXPIRY_TIME = '15m';

const DEFAULT_ROLE = 'User';
const DEFAULT_COUNTRY = 'NP';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private userService: UserService,
    private roleService: RolesService,
    private countryService: CountryService,
    private jwtService: JwtService,
  ) {}

  private generateJwt(payload: object) {
    return this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRY_TIME,
    });
  }

  async googleSignIn(user: GoogleProfile) {
    if (!user) {
      throw new BadRequestException('Nyet user');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
      relations: { roles: true, country: true },
    });

    if (!existingUser) {
      return this.googleRegisterUser(user);
    }

    const payload: JWTUser = {
      id: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
      role: Role.USER,
      designation: existingUser.designation,
      gender: existingUser.gender,
      country: existingUser.country.countryName,
      dateOfBirth: existingUser.dateOfBirth,
    };
    return {
      access_token: this.generateJwt(payload),
    };
  }

  async googleRegisterUser(user: GoogleProfile) {
    // TODO replace role with eum
    const UserRole =
      await this.roleService.findRoleEntityByRoleName(DEFAULT_ROLE);

    const UserCountry =
      await this.countryService.findByCountryCode(DEFAULT_COUNTRY);
    const userEntity = this.userRepository.create({
      ...user,
      roles: [UserRole],
      country: UserCountry,
    });

    const res = await this.userRepository.save(userEntity);

    const jwtPayload: JWTUser = {
      country: res.country.countryName,
      designation: res.designation,
      email: res.email,
      username: res.username,
      gender: res.gender,
      id: res.id,
      role: Role.USER,
    };

    return {
      access_token: this.generateJwt(jwtPayload),
    };
  }
}
