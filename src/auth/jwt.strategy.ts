import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { RefreshTokenRequest } from './auth.request';

export interface JwtPayload {
  sub: string;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private readonly authService: AuthService) {
    super({
      secretOrKey: 'ACCESS_JWT_SECRET',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    return await this.authService.validateAccessToken(payload);
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly authService: AuthService) {
    super({
      secretOrKey: 'REFRESH_JWT_SECRET',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  // TODO: check whether token is really expired, otherwise, tokens can be issued infinitely
  async validate(request: Request, payload: JwtPayload) {
    const { expiredToken } = request.body satisfies RefreshTokenRequest;
    return await this.authService.validateRefreshToken(payload, expiredToken);
  }
}
