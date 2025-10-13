import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'socket.io';
import { UserSession } from '../auth/user-session';
import { Constant } from '@/constants';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SocketService {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService
  ) {}

  async handleClientConnect(client: Socket): Promise<void> {
    const token = this.getToken(client);
    const userSession = this.authService.fromToken(token) as UserSession;
    if (!userSession) {
      client.emit('error', {
        message: 'Unauthorized'
      });
      client.disconnect(true);
    }

    await this.handleCacheClientSession(userSession, client);
  }

  getToken(client: Socket) {
    const authHeader = client.handshake.headers[Constant.HEADER_AUTHORIZATION];
    const token = (authHeader as string)?.replace(/^Bearer\s+/, '');
    return token;
  }

  async handleCacheClientSession(userSession: UserSession, client: Socket) {
    const keyType = userSession.getKeyType();
    const key = `${keyType}:${userSession.id}:${client.id}`;
    await this.redisService.set(key, userSession.id, 60 * 1000); // 1 minute
  }
}
