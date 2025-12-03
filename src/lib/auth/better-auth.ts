import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Pas de vérification email pour l'instant
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 jours (en secondes)
    updateAge: 60 * 60 * 24, // Renouveler la session tous les jours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 30, // 30 jours
    },
  },
  socialProviders: {
    // Pas de providers OAuth pour l'instant
  },
  secret: process.env.AUTH_SECRET!,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'],
});
