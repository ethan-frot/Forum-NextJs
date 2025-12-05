'use client';

import { PublicUserInfo } from '../types/getUserContributions.types';
import { Card, CardContent } from '@/components/ui/card';
import { formatMemberSince } from '@/lib/date';
import { User } from 'lucide-react';
import Image from 'next/image';

interface UserProfileHeaderProps {
  user: PublicUserInfo;
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardContent className="flex items-start gap-6 py-8">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name || 'Avatar utilisateur'}
            width={96}
            height={96}
            className="rounded-full object-cover border-2 border-white/20"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white border-2 border-white/20">
            {user.name ? (
              <span className="text-3xl font-bold">
                {user.name[0].toUpperCase()}
              </span>
            ) : (
              <User className="w-12 h-12" />
            )}
          </div>
        )}

        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold text-white">
            {user.name || 'Utilisateur'}
          </h1>
          {user.bio && <p className="text-white/70 text-base">{user.bio}</p>}
          <p className="text-white/50 text-sm">
            Membre {formatMemberSince(new Date(user.createdAt))}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
