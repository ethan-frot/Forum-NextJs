import { DefaultSession } from 'next-auth';

/**
 * Extension des types NextAuth pour ajouter l'ID utilisateur
 *
 * Par défaut, NextAuth ne contient que email, name, image dans User.
 * On ajoute l'ID pour pouvoir l'utiliser dans nos use cases.
 */
declare module 'next-auth' {
  /**
   * Extension de l'interface Session
   */
  interface Session {
    user: {
      id: string; // Ajout de l'ID utilisateur
    } & DefaultSession['user'];
  }

  /**
   * Extension de l'interface User
   */
  interface User {
    id: string;
    email: string;
    name?: string | null;
  }
}

/**
 * Extension du JWT pour inclure l'ID utilisateur
 */
declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
  }
}
