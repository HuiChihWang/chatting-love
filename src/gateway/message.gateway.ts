import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection() {
    console.log(`WebSocket client connected.`);
  }

  handleDisconnect() {
    console.log(`WebSocket client disconnected.`);
  }

  @SubscribeMessage('message')
  async receiveMessage(@MessageBody() { userId, content }: any) {
    console.log(`receive message in socket from user...${userId}`);
    const replyMsg = {
      type: 'reply',
      userId: userId,
      content,
    };

    this.server.emit(`message-${userId}`, replyMsg);
    this.server.emit('message', 'global message');
  }
}
