import { RedisService } from '@/modules/redis/redis.service';
import { SocketGateway } from '@/modules/socket/socket.gateway';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcessBroadcastHandler {
  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly redisService: RedisService
  ) {}

  async handleNotificationNewOrder(form: any) {
    const keysEmp: Set<string> = await this.redisService.getKeysByPrefix('emp');

    const promises: Promise<void>[] = [];
    for (const key of keysEmp) {
      // ${keyType}:${userId}:${sessionId}
      const parts = key.split(':');
      const userId = parts[1];
      const sessionId = parts[2];

      const message = {
        accountId: userId,
        ...form
      };

      this.socketGateway.handleSendMessgae(sessionId, 'notification', message);
    }
    await Promise.all(promises);
  }

  async handleNotificationCustomer(form: any) {
    const keysUser: Set<string> = await this.redisService.getKeysByPrefix(
      `usr:${form.accountId}`
    );

    const promises: Promise<void>[] = [];
    for (const key of keysUser) {
      // ${keyType}:${userId}:${sessionId}
      const parts = key.split(':');
      const userId = parts[1];
      const sessionId = parts[2];

      const message = {
        accountId: userId,
        ...form
      };

      this.socketGateway.handleSendMessgae(sessionId, 'notification', message);
    }
    await Promise.all(promises);
  }
}
