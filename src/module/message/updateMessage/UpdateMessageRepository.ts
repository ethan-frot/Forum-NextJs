import { Message } from '@/domain/message/Message';

export interface UpdateMessageRepository {
  findById(id: string): Promise<Message | null>;
  update(message: Message): Promise<void>;
}
