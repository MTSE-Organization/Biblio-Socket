import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqAdminService } from './rabbitmq-admin.service';
import { RabbitmqListenerService } from './rabbitmq-listener.service';
import { SocketModule } from '../socket/socket.module';
import { ProcessBroadcastHandler } from './cmd/process.broadcast.handler';

@Module({
  providers: [
    RabbitmqAdminService,
    RabbitmqService,
    RabbitmqListenerService,
    ProcessBroadcastHandler
  ],
  exports: [RabbitmqService],
  imports: [SocketModule]
})
export class RabbitmqModule {}
