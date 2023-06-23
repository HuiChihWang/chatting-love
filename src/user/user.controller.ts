import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './user.request';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() request: CreateUserRequest) {
    return await this.userService.createUser(request);
  }
}
