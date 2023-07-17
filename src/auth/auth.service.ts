import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInRequest } from './auth.request';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.strategy';

import { CacheService } from '../cache/cache.service';
import { UserCacheObject } from '../cache/cache.interface';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtToken } from './token.entity';
import { Repository } from 'typeorm';

import * as moment from 'moment';
import { use } from 'passport';

export interface TokenSet {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
    @InjectRepository(JwtToken)
    private readonly jwtRepository: Repository<JwtToken>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signInLocal(request: SignInRequest): Promise<TokenSet> {
    const user = await this.userRepository.findOne({
      where: {
        username: request.username,
      },
      relations: ['token'],
    });

    if (!user?.password) {
      throw new UnauthorizedException(
        'user cannot be logged in through basic auth',
      );
    }

    const isMatch = request.password === user.password;

    if (!isMatch) {
      throw new UnauthorizedException('username or password is wrong');
    }

    // example: cache user state
    const userCache = await this.cacheService.get<UserCacheObject>(user.id);
    userCache.lastLoginTime = new Date();
    await this.cacheService.put(user.id, userCache);
    //

    const userToken = user?.token;

    const currentDate = moment().utc();
    const updatedExpiredAt = currentDate.clone().add(1, 'day');

    if (!userToken) {
      console.log('generate new token');
      user.token = await this.jwtRepository.create({
        accessToken: await this.generateAccessToken(user),
        refreshToken: await this.generateRefreshToken(user),
        expiredAt: updatedExpiredAt.toDate(),
      });
    } else if (userToken.expiredAt < currentDate.toDate()) {
      console.log('update token');
      await this.jwtRepository.update(user.token.id, {
        accessToken: await this.generateAccessToken(user),
        refreshToken: await this.generateRefreshToken(user),
        expiredAt: updatedExpiredAt.toDate(),
      });
    }

    const updatedUser = await this.userRepository.save(user);
    const { accessToken, refreshToken } = updatedUser.token;

    return { accessToken, refreshToken };
  }

  async logout(user: User) {
    await this.cacheService.delete(user.id);
    await this.userRepository.update(user.id, { token: null });
    await this.jwtRepository.delete(user.token.id);
  }

  async refreshJwtToken(user: User) {
    console.log(`[Auth Service] Refresh token for user ${user.username}`);

    const newAccessToken = await this.generateAccessToken(user);
    user.token.accessToken = newAccessToken;

    await this.userRepository.save(user);

    return newAccessToken;
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

  async extractUserFromTokenPayload(payload: JwtPayload) {
    const { username } = payload;
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
      relations: ['token'],
    });

    if (!user) {
      throw new UnauthorizedException('token invalid');
    }

    return user;
  }

  async validateAccessToken(payload: JwtPayload, accessTokenInHeader: string) {
    const user = await this.extractUserFromTokenPayload(payload);
    const accessTokenInDB = user?.token?.accessToken;

    if (accessTokenInDB !== accessTokenInHeader) {
      throw new UnauthorizedException('access token expired');
    }

    return user;
  }

  async validateRefreshToken(
    refreshTokenPayload: JwtPayload,
    refreshTokenInHeader: string,
  ) {
    const user = await this.extractUserFromTokenPayload(refreshTokenPayload);
    const refreshTokenInDB = user?.token?.refreshToken;

    if (refreshTokenInHeader !== refreshTokenInDB) {
      throw new UnauthorizedException('refresh token expired');
    }

    return user;
  }
}
