import { prisma } from '@/lib/prisma';
import { UpdateMessageRepository } from './UpdateMessageRepository';
import { Message } from '@/domain/message/Message';
import { PrismaClient } from '@/generated/prisma';
import { toMessageDomain } from '../shared/messageMapper';

export class UpdateMessagePrismaRepository implements UpdateMessageRepository {
  private prismaClient: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prismaClient = prismaClient || prisma;
  }

  async findById(id: string): Promise<Message | null> {
    const data = await this.prismaClient.message.findUnique({
      where: { id, deletedAt: null },
    });

    if (!data) return null;

    return toMessageDomain(data);
  }

  async update(message: Message): Promise<void> {
    await this.prismaClient.message.update({
      where: { id: message.id },
      data: {
        content: message.content,
        updatedAt: new Date(),
      },
    });
  }
}
