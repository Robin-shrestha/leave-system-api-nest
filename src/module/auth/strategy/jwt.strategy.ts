import { Repository } from 'typeorm';
import { JWTUser } from '../types/profile.type';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Users } from 'src/module/user/entities/users.entity';
import { ConfigService } from 'src/module/config/config.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['access_token'];
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super({
      ignoreExpiration: false,
      secretOrKey: configService.getJwtConfig().secret,
      jwtFromRequest: extractJwtFromCookie,
    });
  }

  // sets the user object in request object
  async validate(payload: JWTUser) {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
      relations: { country: true },
    });

    if (!user) throw new UnauthorizedException('Please log in to continue');

    const userPayload: JWTUser = {
      ...user,
      country: user.country.countryName,
    };

    return userPayload;
  }
}
