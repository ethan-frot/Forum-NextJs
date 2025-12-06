import { prisma } from '@/lib/prisma';
import { Conversation } from '@/domain/conversation/Conversation';
import { PrismaClient } from '@/generated/prisma';
import { toConversationDomain } from './conversationMapper';

export class ConversationReader {
  private prismaClient: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prismaClient = prismaClient || prisma;
  }

  async findById(id: string): Promise<Conversation | null> {
    const data = await this.prismaClient.conversation.findUnique({
      where: { id, deletedAt: null },
    });

    if (!data) return null;

    return toConversationDomain(data);
  }
}
