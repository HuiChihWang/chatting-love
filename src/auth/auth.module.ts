import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtRefreshStrategy, JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '../cache/cache.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtToken } from './token.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    PassportModule,
    CacheModule,
    TypeOrmModule.forFeature([JwtToken, User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
