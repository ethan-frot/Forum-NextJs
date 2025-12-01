import { prisma } from '@/lib/prisma';
import { CreateMessageRepository } from './CreateMessageRepository';
import { Message } from '@/domain/message/Message';
import { PrismaClient } from '@prisma/client';

export class CreateMessagePrismaRepository implements CreateMessageRepository {
  private prismaClient: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prismaClient = prismaClient || prisma;
  }

  async findConversationById(conversationId: string): Promise<boolean> {
    const conversation = await this.prismaClient.conversation.findFirst({
      where: {
        id: conversationId,
        deletedAt: null,
      },
    });

    return conversation !== null;
  }

  async save(message: Message): Promise<string> {
    const result = await this.prismaClient.message.create({
      data: {
        content: message.content,
        authorId: message.authorId,
        conversationId: message.conversationId!,
      },
    });

    return result.id;
  }
}
