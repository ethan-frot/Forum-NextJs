import { Message } from '@/domain/message/Message';
import { Message as PrismaMessage } from '@/generated/prisma';

export function toMessageDomain(data: PrismaMessage): Message {
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
