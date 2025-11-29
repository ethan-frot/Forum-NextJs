import { ConversationWithMessages } from './types/getConversationById.types';

export interface GetConversationByIdRepository {
  findById(id: string): Promise<ConversationWithMessages | null>;
}
