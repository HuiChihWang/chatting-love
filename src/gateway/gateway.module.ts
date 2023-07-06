import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [MessageGateway],
})
export class GatewayModule {}
