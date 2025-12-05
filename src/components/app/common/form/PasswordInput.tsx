'use client';

import { forwardRef } from 'react';
import { Lock } from 'lucide-react';
import { IconInput } from '../IconInput';
import Link from 'next/link';

interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'icon'
> {
  id?: string;
  label?: string;
  error?: string;
  showHelperText?: boolean;
  showForgotPasswordLink?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      id = 'password',
      label = 'Mot de passe',
      error,
      placeholder = '••••••••',
      showHelperText = true,
      showForgotPasswordLink = false,
      ...props
    },
    ref
  ) => {
    return (
      <IconInput
        ref={ref}
        id={id}
        label={label}
        type="password"
        icon={Lock}
        placeholder={placeholder}
        error={error}
        labelExtra={
          showForgotPasswordLink ? (
            <Link
              href="/forgot-password"
              className="text-xs text-blue-300/80 hover:text-blue-200 transition-colors hover:underline underline-offset-4"
            >
              Mot de passe oublié ?
            </Link>
          ) : undefined
        }
        helperText={
          showHelperText
            ? 'Minimum 8 caractères avec majuscule, minuscule, chiffre et caractère spécial'
            : undefined
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
