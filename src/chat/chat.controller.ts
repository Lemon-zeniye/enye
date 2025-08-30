import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat/sessions')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  // GET /admin/sessions -> list of active sessionIds
  @Get('')
  async getSessions() {
    const sessions = await this.chatService.getAllSessions();
    return sessions;
  }

  // GET /admin/sessions/:id/messages -> chat history
  @Get(':id/messages')
  async getMessages(@Param('id') sessionId: string) {
    return this.chatService.getMessages(sessionId);
  }

  @Post(':messageId/read')
  async markMessageAsRead(@Param('messageId') messageId: string) {
    return this.chatService.markMessageAsRead(messageId);
  }

  @Post(':sessionId/read')
  async markSessionAsRead(@Param('sessionId') sessionId: string) {
    return this.chatService.markSessionAsRead(sessionId);
  }

  @Get(':sessionId/unread-count')
  async getUnreadCount(@Param('sessionId') sessionId: string) {
    return this.chatService.getUnreadCount(sessionId);
  }

  @Delete(':id')
  async deleteSession(@Param('id') sessionId: string) {
    return this.chatService.deleteSession(sessionId);
  }
}
