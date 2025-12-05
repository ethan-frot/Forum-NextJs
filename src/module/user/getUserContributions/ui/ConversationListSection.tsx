'use client';

import { ConversationContribution } from '../types/getUserContributions.types';
import { ConversationCard } from './ConversationCard';

interface ConversationListSectionProps {
  conversations: ConversationContribution[];
}

export function ConversationListSection({
  conversations,
}: ConversationListSectionProps) {
  if (conversations.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Conversations créées</h2>
        <p className="text-white/50 text-center py-8">
          Aucune conversation créée pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">
        Conversations créées ({conversations.length})
      </h2>
      <div className="grid gap-4">
        {conversations.map((conversation) => (
          <ConversationCard key={conversation.id} conversation={conversation} />
        ))}
      </div>
    </div>
  );
}
