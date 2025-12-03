/**
 * Helpers d'authentification Better Auth
 *
 * Utilitaires pour gérer l'authentification côté serveur (API routes, server components).
 */
import { headers } from 'next/headers';
import { auth } from './better-auth';

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    throw new Error('Authentification requise');
  }

  return session.user;
}
