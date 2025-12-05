'use client';

import { MessageContribution } from '../types/getUserContributions.types';
import { Card, CardContent } from '@/components/ui/card';
import { getRelativeTime } from '@/lib/date';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface MessageCardProps {
  message: MessageContribution;
}

export function MessageCard({ message }: MessageCardProps) {
  return (
    <Link href={`/conversations/${message.conversationId}`}>
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.01] cursor-pointer">
        <CardContent className="py-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <MessageSquare className="w-4 h-4" />
              <span className="truncate">{message.conversationTitle}</span>
            </div>

            <p className="text-white/90 line-clamp-3">{message.content}</p>

            <p className="text-white/50 text-xs">
              {getRelativeTime(new Date(message.createdAt))}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
