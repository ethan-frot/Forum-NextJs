'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import {
  EmailInput,
  PasswordInput,
  EMAIL_VALIDATION,
} from '@/components/app/common/form';
import { GradientButton } from '@/components/app/common/GradientButton';

interface SignInFormData {
  email: string;
  password: string;
}

/**
 * Formulaire de connexion (US-10)
 *
 * Utilise NextAuth pour authentifier l'utilisateur via le Credentials Provider.
 * Le provider appelle le SignInUseCase côté serveur pour valider les credentials.
 */
export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);

    try {
      // Utilisation de la fonction signIn de NextAuth
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // On gère la redirection manuellement
      });

      // Vérification des erreurs : NextAuth retourne error si l'authentification échoue
      if (result?.error) {
        // Échec de la connexion (CredentialsSignin)
        toast.error('Email ou mot de passe incorrect');
        return;
      }

      // Vérification supplémentaire : ok doit être true
      if (!result?.ok) {
        toast.error('Une erreur est survenue lors de la connexion');
        return;
      }

      // Succès de la connexion
      toast.success('Connexion réussie');

      // Redirection vers la page d'accueil après un court délai
      setTimeout(() => {
        router.push('/');
        router.refresh(); // Force le rafraîchissement pour mettre à jour la session
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      toast.error('Une erreur inattendue est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        {...register('password', {
          required: 'Le mot de passe est requis',
        })}
      />

      {/* Bouton Submit */}
      <GradientButton
        type="submit"
        isLoading={isLoading}
        loadingText="Connexion en cours..."
      >
        Se connecter
      </GradientButton>
    </form>
  );
}
