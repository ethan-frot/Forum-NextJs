import type { NextAuthConfig } from 'next-auth';

/**
 * Configuration NextAuth compatible avec Edge Runtime
 *
 * Utilisée par le middleware pour protéger les routes.
 * Cette configuration est séparée car le middleware s'exécute en Edge Runtime
 * et ne peut pas importer Prisma ou d'autres dépendances Node.js.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    // Vérification de l'autorisation d'accès aux routes protégées
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = nextUrl.pathname.startsWith('/contributions');

      // Si route protégée et utilisateur non connecté, rediriger vers /signin
      if (isOnProtectedRoute && !isLoggedIn) {
        return false;
      }

      return true;
    },
  },
  providers: [], // Les providers sont définis dans auth.ts
};
