import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'messages',
  timestamps: true,
})
export class Message {
  @Prop({
    required: true,
  })
  fromUser: string;

  @Prop({
    required: true,
  })
  toUser: string;

  @Prop({
    minlength: 1,
    required: true,
  })
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
