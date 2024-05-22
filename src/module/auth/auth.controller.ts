import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Response as Resp } from 'src/utils';
import { AuthService } from './auth.service';
import { Public } from './decorators/Public.decorator';
import { GoogleAuthGuard } from './guards/googleAuth.guard';
import { GoogleProfile, JWTUser } from './types/profile.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Sign In with google' })
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Public()
  @ApiOperation({ summary: 'Callback route for google auth' })
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
  @ApiOperation({ summary: 'Get new Access Tokens once expired' })
  refreshTokens() {
    throw new Error('NOt yet implemented');
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Returns the user Profile' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Resp<JWTUser>,
  })
  @Get('profile')
  profile(@Req() req: Request) {
    return req.user;
  }
}
