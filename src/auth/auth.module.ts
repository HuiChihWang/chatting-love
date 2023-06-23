import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import JwtAuthModule from './jwt.module';

@Module({
  imports: [UserModule, JwtAuthModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
