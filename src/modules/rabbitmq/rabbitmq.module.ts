import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqAdminService } from './rabbitmq-admin.service';
import { RabbitmqListenerService } from './rabbitmq-listener.service';
import { SocketModule } from '../socket/socket.module';

@Module({
  providers: [RabbitmqAdminService, RabbitmqService, RabbitmqListenerService],
  exports: [RabbitmqService],
  imports: [SocketModule]
})
export class RabbitmqModule {}
