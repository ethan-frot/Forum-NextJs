'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
      toast.success('Compte créé avec succès ! 🎉');

      // Redirection vers la home page après un court délai
      setTimeout(() => {
        router.push('/');
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
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white/90">
          Nom <span className="text-white/50 text-xs">(optionnel)</span>
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            id="name"
            type="text"
            placeholder="Alice Dupont"
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/50"
            {...register('name', {
              maxLength: {
                value: 100,
                message: 'Le nom ne peut pas dépasser 100 caractères',
              },
            })}
            disabled={isLoading}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-red-400">{errors.name.message}</p>
        )}
      </div>

      {/* Champ Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/90">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            id="email"
            type="email"
            placeholder="alice@example.com"
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/50"
            {...register('email', {
              required: 'L\'email est requis',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Format d\'email invalide',
              },
              maxLength: {
                value: 255,
                message: 'L\'email ne peut pas dépasser 255 caractères',
              },
            })}
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* Champ Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white/90">
          Mot de passe
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/50"
            {...register('password', {
              required: 'Le mot de passe est requis',
              minLength: {
                value: 8,
                message: 'Le mot de passe doit contenir au moins 8 caractères',
              },
              validate: {
                hasUppercase: (value) =>
                  /[A-Z]/.test(value) || 'Doit contenir au moins une majuscule',
                hasLowercase: (value) =>
                  /[a-z]/.test(value) || 'Doit contenir au moins une minuscule',
                hasNumber: (value) =>
                  /[0-9]/.test(value) || 'Doit contenir au moins un chiffre',
                hasSpecial: (value) =>
                  /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(value) ||
                  'Doit contenir au moins un caractère spécial',
              },
            })}
            disabled={isLoading}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
        <p className="text-xs text-white/50">
          Minimum 8 caractères avec majuscule, minuscule, chiffre et caractère spécial
        </p>
      </div>

      {/* Bouton Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/50 transition-all duration-300 hover:shadow-purple-500/70 hover:scale-[1.02]"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Création en cours...
          </>
        ) : (
          'Créer mon compte'
        )}
      </Button>
    </form>
  );
}
