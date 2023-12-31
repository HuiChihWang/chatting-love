import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SignInRequest } from './auth.request';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async signInLocal(@Body() request: SignInRequest) {
    const { accessToken, refreshToken } = await this.authService.signInLocal(
      request,
    );

    return {
      accessToken,
      refreshToken,
      message: 'sign in with username/password successfully',
    };
  }

  @Post('/refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshToken(@Req() request: Request) {
    const user = request.user as User;
    const accessToken = await this.authService.refreshJwtToken(user);

    return {
      accessToken,
      message: 'refresh token successfully.',
    };
  }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt-access'))
  async logout(@Req() request: Request) {
    const user = request.user as User;
    await this.authService.logout(user);

    return {
      message: 'log out successfully',
    };
  }
}
