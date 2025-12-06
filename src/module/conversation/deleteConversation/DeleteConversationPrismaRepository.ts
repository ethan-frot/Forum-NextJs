import { prisma } from '@/lib/prisma';
import { DeleteConversationRepository } from './DeleteConversationRepository';
import { Conversation } from '@/domain/conversation/Conversation';
import { PrismaClient } from '@/generated/prisma';
import { ConversationReader } from '../shared/ConversationReader';

export class DeleteConversationPrismaRepository implements DeleteConversationRepository {
  private prismaClient: PrismaClient;
  private reader: ConversationReader;

  constructor(prismaClient?: PrismaClient) {
    this.prismaClient = prismaClient || prisma;
    this.reader = new ConversationReader(this.prismaClient);
  }

  async findById(id: string): Promise<Conversation | null> {
    return this.reader.findById(id);
  }

  async delete(id: string): Promise<void> {
    const now = new Date();

    await this.prismaClient.$transaction([
      this.prismaClient.message.updateMany({
        where: { conversationId: id },
        data: { deletedAt: now },
      }),
      this.prismaClient.conversation.update({
        where: { id },
        data: { deletedAt: now },
      }),
    ]);
  }
}
