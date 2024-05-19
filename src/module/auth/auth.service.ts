import { BadRequestException, Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Role } from 'src/types/enums';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../user/entities/users.entity';
import { CountryService } from '../country/country.service';
import { GoogleProfile, JWTUser } from './types/profile.type';

const ACCESS_TOKEN_EXPIRY_TIME = '15m';

const DEFAULT_COUNTRY = 'NP';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private userService: UserService,
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
      relations: { country: true },
    });

    if (!existingUser) {
      return this.googleRegisterUser(user);
    }

    const payload: JWTUser = {
      id: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
      designation: existingUser.designation,
      gender: existingUser.gender,
      country: existingUser.country.countryName,
      dateOfBirth: existingUser.dateOfBirth,
      role: existingUser.role,
    };
    return {
      access_token: this.generateJwt(payload),
    };
  }

  async googleRegisterUser(user: GoogleProfile) {
    const UserCountry =
      await this.countryService.findByCountryCode(DEFAULT_COUNTRY);
    const userEntity = this.userRepository.create({
      ...user,
      role: Role.USER,
      country: UserCountry,
    });

    const res = await this.userRepository.save(userEntity);

    const jwtPayload: JWTUser = {
      id: res.id,
      role: res.role,
      email: res.email,
      gender: res.gender,
      username: res.username,
      designation: res.designation,
      country: res.country.countryName,
    };

    return {
      access_token: this.generateJwt(jwtPayload),
    };
  }
}
