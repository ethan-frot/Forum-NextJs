import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { SignInUseCase } from '@/module/user/signIn/SignInUseCase';
import { SignInPrismaRepository } from '@/module/user/signIn/SignInPrismaRepository';

/**
 * Configuration NextAuth v5 pour l'authentification
 *
 * Utilise un Credentials Provider qui s'appuie sur le SignInUseCase
 * pour valider les credentials (architecture Clean).
 *
 * Règles de session (US-10) :
 * - Access Token : 5 minutes (maxAge)
 * - Refresh Token : 30 jours (géré automatiquement par NextAuth)
 * - Cookies httpOnly et sameSite: lax (sécurité)
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validation des inputs
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Utilisation du SignInUseCase (Clean Architecture)
          const repository = new SignInPrismaRepository();
          const useCase = new SignInUseCase(repository);

          const result = await useCase.execute({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          // Retourne l'objet utilisateur pour NextAuth
          return {
            id: result.userId,
            email: result.email,
            name: result.name,
          };
        } catch (error) {
          // En cas d'erreur, retourner null (échec d'authentification)
          console.error('Erreur lors de la connexion:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours (Refresh Token)
  },
  jwt: {
    maxAge: 5 * 60, // 5 minutes (Access Token) - US-10
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true, // Protection XSS
        sameSite: 'lax', // Protection CSRF
        path: '/',
        secure: process.env.NODE_ENV === 'production', // HTTPS en production
      },
    },
  },
  callbacks: {
    // Injection de l'ID utilisateur dans le token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Injection de l'ID utilisateur dans la session
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin', // Page de connexion custom
  },
});
