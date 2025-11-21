'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  EmailInput,
  PasswordInput,
  NameInput,
  EMAIL_VALIDATION,
  PASSWORD_VALIDATION,
  NAME_VALIDATION
} from '@/components/app/common/form';
import { GradientButton } from '@/components/app/common/GradientButton';

interface SignUpFormData {
  email: string;
  password: string;
  name?: string;
}

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Erreur serveur (400, 409, 500)
        toast.error(result.error || 'Une erreur est survenue');
        return;
      }

      // Succès
      toast.success('Compte créé avec succès');

      // Redirection vers la page de connexion après un court délai
      setTimeout(() => {
        router.push('/signin');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      toast.error('Une erreur inattendue est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Champ Name (optionnel) */}
      <NameInput
        error={errors.name?.message}
        disabled={isLoading}
        optional
        {...register('name', NAME_VALIDATION)}
      />

      {/* Champ Email */}
      <EmailInput
        error={errors.email?.message}
        disabled={isLoading}
        {...register('email', EMAIL_VALIDATION)}
      />

      {/* Champ Password */}
      <PasswordInput
        error={errors.password?.message}
        disabled={isLoading}
        {...register('password', PASSWORD_VALIDATION)}
      />

      {/* Bouton Submit */}
      <GradientButton
        type="submit"
        isLoading={isLoading}
        loadingText="Création en cours..."
      >
        Créer mon compte
      </GradientButton>
    </form>
  );
}
