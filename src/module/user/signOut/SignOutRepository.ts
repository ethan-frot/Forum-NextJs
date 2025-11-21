/**
 * Interface du repository pour le use case SignOut
 *
 * Cette interface suit le principe d'inversion de dépendance :
 * - Le use case dépend de cette interface (port), pas d'une implémentation concrète
 * - Le repository Prisma (adapter) implémentera cette interface
 */
export interface SignOutRepository {
  /**
   * Révoque toutes les sessions actives d'un utilisateur
   *
   * Cette méthode marque toutes les sessions de l'utilisateur comme révoquées
   * en définissant le champ `revokedAt` à la date actuelle.
   *
   * @param userId - L'identifiant de l'utilisateur
   * @returns Le nombre de sessions révoquées
   */
  revokeAllUserSessions(userId: string): Promise<number>;
}
