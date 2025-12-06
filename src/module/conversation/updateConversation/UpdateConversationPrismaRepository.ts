import { prisma } from '@/lib/prisma';
import { UpdateConversationRepository } from './UpdateConversationRepository';
import { Conversation } from '@/domain/conversation/Conversation';
import { PrismaClient } from '@/generated/prisma';
import { ConversationReader } from '../shared/ConversationReader';

export class UpdateConversationPrismaRepository implements UpdateConversationRepository {
  private prismaClient: PrismaClient;
  private reader: ConversationReader;

  constructor(prismaClient?: PrismaClient) {
    this.prismaClient = prismaClient || prisma;
    this.reader = new ConversationReader(this.prismaClient);
  }

  async findById(id: string): Promise<Conversation | null> {
    return this.reader.findById(id);
  }

  async update(conversation: Conversation): Promise<void> {
    await this.prismaClient.conversation.update({
      where: { id: conversation.id },
      data: {
        title: conversation.title,
      },
    });
  }
}
