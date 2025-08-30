// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Sender } from './entities/message.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() sessionId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(sessionId);
    const history = await this.chatService.getMessages(sessionId);
    client.emit('chat_history', history);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() payload: { sessionId: string; sender: Sender; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (!payload?.sessionId || !payload?.text) {
        throw new WsException('Missing sessionId or text');
      }

      const msg = await this.chatService.saveMessage(
        payload.sessionId,
        payload.text,
        payload.sender,
      );

      this.server.to(payload.sessionId).emit('receive_message', msg);

      if (msg.conversation.messages.length === 1) {
        this.server.emit('new_session', msg.conversation.sessionId);
      }

      return msg;
    } catch (err) {
      // Always wrap unknown errors in WsException
      throw err instanceof WsException ? err : new WsException('Socket error');
    }
  }
}
