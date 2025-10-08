import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitmqAdminService } from './rabbitmq-admin.service';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class RabbitmqListenerService implements OnModuleInit {
  private readonly logger = new Logger(RabbitmqListenerService.name);
  private notificationQueue: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly rabbitMQAdmin: RabbitmqAdminService,
    private readonly socketGateway: SocketGateway
  ) {
    this.notificationQueue = this.configService.get<string>(
      'RABBITMQ_NOTIFICATION_QUEUE'
    )!;
  }

  async onModuleInit() {
    await this.rabbitMQAdmin.listenMessage(
      this.notificationQueue,
      this.handleNotification.bind(this)
    );
  }

  private handleNotification(message: string) {
    const payload = JSON.parse(message);
    const data = JSON.parse(payload.data);
    const { sessionId, message: notification } = data;

    this.socketGateway.handleSendMessgae(
      sessionId,
      'notification',
      notification
    );
    this.logger.log(`Sent notification to session: ${sessionId}`);
  }
}
