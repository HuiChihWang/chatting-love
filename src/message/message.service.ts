import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.schema';
import { Model } from 'mongoose';
import { CreateMessageRequest } from './message.request';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async createMessage(request: CreateMessageRequest) {
    await this.messageModel.create({
      fromUser: request.fromUser,
      toUser: request.toUser,
      content: request.content,
    });
  }
}
