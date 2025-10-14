import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitmqAdminService } from './rabbitmq-admin.service';
import { Constant } from '@/constants';
import { ProcessBroadcastHandler } from './cmd/process.broadcast.handler';
import { plainToInstance } from 'class-transformer';
import { BaseSendMsgForm } from './forms/base-send-msg.form';

@Injectable()
export class RabbitmqListenerService implements OnModuleInit {
  private notificationQueue: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly rabbitMQAdmin: RabbitmqAdminService,
    private readonly processBroadcastHandler: ProcessBroadcastHandler
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

  private async handleNotification(message: string) {
    const payload = plainToInstance(BaseSendMsgForm, JSON.parse(message));
    const data = JSON.parse(payload.data);
    switch (payload.cmd) {
      case Constant.CMD_BROADCAST:
        await this.handleProcessBroadcast(data, payload.subCmd);
        break;

      default:
        console.log('Unknown command:', payload.cmd);
        break;
    }
  }

  private async handleProcessBroadcast(data: any, subCmd: string | null) {
    switch (subCmd) {
      case Constant.CMD_NOTIFICATION_NEW_ORDER:
        await this.processBroadcastHandler.handleNotificationNewOrder(data);
        break;

      default:
        console.log('Unknown command:', subCmd);
        break;
    }
  }
}
