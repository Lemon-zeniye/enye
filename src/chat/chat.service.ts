// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message, Sender } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation) private convRepo: Repository<Conversation>,
    @InjectRepository(Message) private msgRepo: Repository<Message>,
  ) {}

  async findOrCreateConversation(sessionId: string) {
    let conv = await this.convRepo.findOne({ where: { sessionId } });
    if (!conv) {
      conv = this.convRepo.create({ sessionId });
      conv = await this.convRepo.save(conv);
    }
    return conv;
  }

  async saveMessage(sessionId: string, text: string, sender: Sender) {
    const conversation = await this.findOrCreateConversation(sessionId);
    const message = this.msgRepo.create({ text, sender, conversation });
    return this.msgRepo.save(message);
  }

  async getMessages(sessionId: string) {
    const conv = await this.findOrCreateConversation(sessionId);

    return this.msgRepo.find({
      where: { conversation: { id: conv.id } },
      relations: ['conversation'], // include conversation
      order: { createdAt: 'ASC' },
    });
  }

  async deleteSession(sessionId: string) {
    const conv = await this.convRepo.findOne({
      where: { id: sessionId },
    });
    return this.convRepo.remove(conv);
  }

  // src/chat/chat.service.ts
  async getAllSessions() {
    return this.convRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['messages'],
    });
  }

  // Add to your ChatService
  async markMessageAsRead(messageId: string): Promise<Message> {
    const message = await this.msgRepo.findOne({
      where: { id: messageId },
    });

    if (message && message.sender === Sender.CUSTOMER) {
      message.read = true;
      return this.msgRepo.save(message);
    }
    return message;
  }

  async markSessionAsRead(sessionId: string): Promise<void> {
    await this.msgRepo.update(
      {
        conversation: { sessionId },
        sender: Sender.CUSTOMER,
        read: false,
      },
      { read: true },
    );
  }

  async getUnreadCount(sessionId: string): Promise<number> {
    return this.msgRepo.count({
      where: {
        conversation: { sessionId },
        sender: Sender.CUSTOMER,
        read: false,
      },
    });
  }
}
