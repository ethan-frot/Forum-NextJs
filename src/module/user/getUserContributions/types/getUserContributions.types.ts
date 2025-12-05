export interface PublicUserInfo {
  id: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
}

export interface ConversationContribution {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export interface MessageContribution {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  conversationId: string;
  conversationTitle: string;
}

export interface UserContributions {
  user: PublicUserInfo;
  conversations: ConversationContribution[];
  messages: MessageContribution[];
}
