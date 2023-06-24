import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInRequest } from './auth.request';
import { UserService } from '../user/user.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.strategy';

import { CacheService } from '../cache/cache.service';
import { UserCacheObject } from '../cache/cache.interface';

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

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    // example: cache user state
    const userCache = await this.cacheService.get<UserCacheObject>(user.id);
    userCache.lastLoginTime = new Date();
    await this.cacheService.put(user.id, userCache);

    return await this.jwtService.signAsync(payload);
  }

  async validateJwtPayload(payload: JwtPayload) {
    const username = payload?.username;

    if (!username) {
      throw new UnauthorizedException();
    }

    const user = this.userService.findUser(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
