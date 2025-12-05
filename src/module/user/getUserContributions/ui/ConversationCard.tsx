'use client';

import { ConversationContribution } from '../types/getUserContributions.types';
import { Card, CardContent } from '@/components/ui/card';
import { getRelativeTime } from '@/lib/date';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface ConversationCardProps {
  conversation: ConversationContribution;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  return (
    <Link href={`/conversations/${conversation.id}`}>
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.01] cursor-pointer">
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-white mb-2 truncate">
                {conversation.title}
              </h3>
              <p className="text-white/50 text-sm">
                Créée {getRelativeTime(new Date(conversation.createdAt))}
              </p>
            </div>

            <div className="flex items-center gap-2 text-white/70 shrink-0">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{conversation.messageCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
