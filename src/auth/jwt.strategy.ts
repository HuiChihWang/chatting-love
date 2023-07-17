import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { RefreshTokenRequest } from './auth.request';

export interface JwtPayload {
  sub: string;
  username: string;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private readonly authService: AuthService) {
    super({
      secretOrKey: 'ACCESS_JWT_SECRET',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    const accessTokenInHeader = request.headers.authorization.split(' ')[1];
    return await this.authService.validateAccessToken(
      payload,
      accessTokenInHeader,
    );
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

  async validate(request: Request, payload: JwtPayload) {
    const refreshTokenString = request.headers.authorization.split(' ')[1];
    return await this.authService.validateRefreshToken(
      payload,
      refreshTokenString,
    );
  }
}
