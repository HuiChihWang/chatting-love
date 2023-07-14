import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageRequest } from './message.request';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../user/user.entity';
import { CacheService } from '../cache/cache.service';
import { UserCacheObject } from '../cache/cache.interface';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly cacheService: CacheService,
  ) {}

  @Post()
  async createSimpleMessage(@Body() request: CreateMessageRequest) {
    await this.messageService.createMessage(request);
  }

  @Get('/public')
  async testPublic() {
    return 'Hello public';
  }

  @Get('/private')
  @UseGuards(AuthGuard('jwt-access'))
  async testPrivate(@Req() request: Request) {
    const user = request.user as User;

    const userState = await this.cacheService.get<UserCacheObject>(user?.id);

    return `Hello ${user.username}, you last login time is ${userState?.lastLoginTime}`;
  }
}
