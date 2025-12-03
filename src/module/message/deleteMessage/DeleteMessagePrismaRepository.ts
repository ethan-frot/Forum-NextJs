import { prisma } from '@/lib/prisma';
import { DeleteMessageRepository } from './DeleteMessageRepository';
import { Message } from '@/domain/message/Message';
import { PrismaClient } from '@/generated/prisma';

export class DeleteMessagePrismaRepository implements DeleteMessageRepository {
  private prismaClient: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prismaClient = prismaClient || prisma;
  }

  async findById(id: string): Promise<Message | null> {
    const data = await this.prismaClient.message.findUnique({
      where: { id },
    });

    if (!data) return null;

    return new Message({
      id: data.id,
      content: data.content,
      authorId: data.authorId,
      conversationId: data.conversationId ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt ?? data.createdAt,
      deletedAt: data.deletedAt ?? undefined,
    });
  }

  async delete(message: Message): Promise<void> {
    await this.prismaClient.message.update({
      where: { id: message.id },
      data: { deletedAt: message.deletedAt },
    });
  }
}
