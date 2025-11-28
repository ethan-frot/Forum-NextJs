import { Conversation } from '@/domain/conversation/Conversation';

export interface ConversationWithCount extends Conversation {
  messageCount: number;
}

export interface ListConversationsRepository {
  findAll(): Promise<ConversationWithCount[]>;
}
