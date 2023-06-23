import { Body, Controller, Post } from '@nestjs/common';
import { SignInRequest } from './auth.request';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/sign-in')
  async signInLocal(@Body() request: SignInRequest) {
    const jwtToken = await this.authService.signInLocal(request);
    return {
      message: 'sign in with username/password successfully',
      access_token: jwtToken,
    };
  }
}
