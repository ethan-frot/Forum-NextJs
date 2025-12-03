'use client';

import { useState } from 'react';
import { useSession, signOut } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';
import { GradientButton } from '@/components/app/common/GradientButton';
import { toast } from 'sonner';

/**
 * AuthButton - Bouton d'authentification en haut à droite
 *
 * Affiche :
 * - Bouton "Connexion" si non authentifié (redirige vers /signin)
 * - Bouton "Déconnexion" si authentifié (US-11)
 */
export function AuthButton() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);

      await signOut();

      toast.success('Déconnexion réussie', {
        description: 'Vous avez été déconnecté avec succès',
      });

      router.refresh();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion', {
        description: 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  if (isPending) {
    return (
      <div className="h-10 w-32 animate-pulse rounded-lg bg-linear-to-r from-blue-500/20 to-violet-600/20" />
    );
  }

  if (!session) {
    return (
      <GradientButton onClick={handleSignIn} size="default" className="w-auto">
        Connexion
      </GradientButton>
    );
  }

  return (
    <GradientButton
      onClick={handleSignOut}
      size="default"
      className="w-auto"
      isLoading={isLoading}
      loadingText="Déconnexion..."
    >
      Déconnexion
    </GradientButton>
  );
}
