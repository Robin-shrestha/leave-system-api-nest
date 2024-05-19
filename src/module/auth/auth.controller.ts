import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/Public.decorator';
import { GoogleAuthGuard } from './guards/googleAuth.guard';
import { Response } from 'express';
import { GoogleProfile } from './types/profile.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const token = await this.authService.googleSignIn(
      req.user as GoogleProfile,
    );

    // TODO redirect url
    const redirectUrl = 'http://localhost:4000/api/user';

    res.cookie('access_token', token.access_token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });

    return res.status(HttpStatus.OK).redirect(redirectUrl);
  }

  @Public()
  @Get('refresh')
  refreshTokens() {
    throw new Error('NOt yet implemented');
  }

  @Get('profile')
  profile() {
    return 'profile';
  }
}
