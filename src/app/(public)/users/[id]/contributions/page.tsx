'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserContributions } from '@/services/user.service';
import { UserProfileHeader } from '@/module/user/getUserContributions/ui/UserProfileHeader';
import { ConversationListSection } from '@/module/user/getUserContributions/ui/ConversationListSection';
import { MessageListSection } from '@/module/user/getUserContributions/ui/MessageListSection';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ContributionsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-contributions', id],
    queryFn: () => fetchUserContributions(id),
  });

  useEffect(() => {
    if (error || (!isLoading && !data)) {
      toast.error('Utilisateur non trouvé');
      router.push('/');
    }
  }, [error, data, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-8 max-w-5xl">
      <UserProfileHeader user={data.user} />
      <ConversationListSection conversations={data.conversations} />
      <MessageListSection messages={data.messages} />
    </div>
  );
}
