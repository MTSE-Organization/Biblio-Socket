import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({
  namespace: '/ws',
  cors: {
    origin: '*'
  }
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Server) {
    console.log('Socket initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    await this.socketService.handleClientConnect(client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleSendMessgae(sessionId: string, event: string, message: string) {
    this.server.to(sessionId).emit(event, message);
  }

  @SubscribeMessage('ping')
  async handlePing(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    console.log(`Received ping from ${client.id}`);
    await this.socketService.handleClientConnect(client);
    client.emit('pong', { message: 'pong', data });
  }
}
