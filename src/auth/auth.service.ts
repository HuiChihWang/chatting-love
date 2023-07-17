import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInRequest } from './auth.request';
import { UserService } from '../user/user.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.strategy';

import { CacheService } from '../cache/cache.service';
import { UserCacheObject } from '../cache/cache.interface';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {}

  async signInLocal(request: SignInRequest) {
    const user = await this.userService.findUser(request.username);

    if (!user?.password) {
      throw new UnauthorizedException(
        'user cannot be logged in through basic auth',
      );
    }

    const isMatch = await bcrypt.compare(request.password, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException('username or password is wrong');
    }

    // example: cache user state
    const userCache = await this.cacheService.get<UserCacheObject>(user.id);
    userCache.lastLoginTime = new Date();
    await this.cacheService.put(user.id, userCache);

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async logout(user: User) {
    await this.cacheService.delete(user.id);

    // revoke token here
  }

  //TODO: cache refresh token in db so we can track token and revoke it
  async refreshJwtToken(user: User) {
    console.log(`[Auth Service] Refresh token for user ${user.username}`);
    return this.generateAccessToken(user);
  }

  private async generateAccessToken(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    return await this.jwtService.signAsync(payload, {
      secret: 'ACCESS_JWT_SECRET',
      expiresIn: '15m',
    });
  }

  private async generateRefreshToken(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    return await this.jwtService.signAsync(payload, {
      secret: 'REFRESH_JWT_SECRET',
      expiresIn: '1d',
    });
  }

  async validateAccessToken(payload: JwtPayload) {
    return await this.extractUserFromTokenPayload(payload);
  }

  async extractUserFromTokenPayload(payload: JwtPayload) {
    const { username } = payload;
    const user = this.userService.findUser(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async validateRefreshToken(
    refreshTokenPayload: JwtPayload,
    expiredToken: string,
  ) {
    const user = await this.extractUserFromTokenPayload(refreshTokenPayload);

    if (!expiredToken) {
      throw new UnauthorizedException();
    }

    const expiredTokenPayload = await this.jwtService.verifyAsync<JwtPayload>(
      expiredToken,
      {
        secret: 'ACCESS_JWT_SECRET',
        ignoreExpiration: true,
      },
    );

    if (expiredTokenPayload.exp > Date.now() / 1000) {
      throw new UnauthorizedException('Token does not expire yet.');
    }

    if (
      refreshTokenPayload.sub !== expiredTokenPayload.sub ||
      expiredTokenPayload.username !== expiredTokenPayload.username
    ) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
