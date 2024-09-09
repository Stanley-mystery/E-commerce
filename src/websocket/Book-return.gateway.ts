import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class BookReturnGateway {
  @WebSocketServer()
  server: Server;

  sendAutoReturnNotification(userId: string, bookTitle: string) {
    this.server.to(userId).emit('bookAutoReturned', { bookTitle });
  }
}
