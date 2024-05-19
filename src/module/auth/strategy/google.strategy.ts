import { Injectable } from '@nestjs/common';
import { AuthProvider } from 'src/types/enums';
import { PassportStrategy } from '@nestjs/passport';
import { GoogleProfile } from '../types/profile.type';
import { ConfigService } from './../../config/config.service';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    const googleConfig = configService.getGoogleAuthConfig();

    super(googleConfig);
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { picture, emails, photos, displayName } = profile;

    // ? this will be stored as the user object in request header
    const user: GoogleProfile = {
      provider: AuthProvider.GOOGLE,
      email: emails[0].value,
      username: displayName,
      profilePicture: picture || photos[0].value,
    };

    done(null, user);
  }
}
