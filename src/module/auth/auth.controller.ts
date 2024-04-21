import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from './decorators/Public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  signIn(@Body() signInCreds: SignInDto) {
    return this.authService.signIn(signInCreds.username, signInCreds.password);
  }

  @Get('profile')
  profile() {
    return 'profile';
  }
}
