/**
 * Service client-side pour les opérations d'authentification
 *
 * Ce service encapsule les appels API liés à l'authentification.
 * Il est utilisé par les composants React via des hooks ou directement.
 *
 * Architecture :
 * - Composants UI → Services (API calls) → Routes API → Use Cases
 * - Séparation claire entre logique UI et logique d'appel API
 */

/**
 * Déconnecte l'utilisateur côté serveur
 *
 * Appelle la route `/api/auth/signout` qui :
 * - Révoque les sessions en base de données
 * - Supprime les cookies NextAuth
 *
 * Cette fonction doit être appelée AVANT `signOut()` de NextAuth
 * pour garantir la révocation complète côté serveur.
 *
 * @throws Error si la déconnexion échoue côté serveur
 */
export async function signOutUser(): Promise<void> {
  const response = await fetch('/api/auth/signout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Échec de la déconnexion côté serveur');
  }
}
