import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageRequest } from './message.request';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createSimpleMessage(@Body() request: CreateMessageRequest) {
    await this.messageService.createMessage(request);
  }
}
