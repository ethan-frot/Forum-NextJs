import { prisma } from '@/lib/prisma';
import { SignOutRepository } from './SignOutRepository';
import { PrismaClient } from '@/generated/prisma';

/**
 * Adapter Prisma pour SignOutRepository
 *
 * Implémente l'interface du repository en utilisant Prisma Client.
 * Révoque toutes les sessions actives d'un utilisateur.
 *
 * Injection de dépendance :
 * - Accepte un PrismaClient optionnel via le constructeur
 * - Utilise le singleton par défaut si aucun client n'est fourni
 * - Permet l'utilisation d'un client de test pour les tests E2E
 */
export class SignOutPrismaRepository implements SignOutRepository {
  private prismaClient: PrismaClient;

  /**
   * Constructeur avec injection de dépendance
   *
   * @param prismaClient - Instance PrismaClient optionnelle (utilise le singleton par défaut)
   */
  constructor(prismaClient?: PrismaClient) {
    this.prismaClient = prismaClient || prisma;
  }

  /**
   * Révoque toutes les sessions actives d'un utilisateur
   *
   * Met à jour toutes les sessions non révoquées (revokedAt = null)
   * en définissant revokedAt à la date actuelle.
   *
   * @param userId - L'identifiant de l'utilisateur
   * @returns Le nombre de sessions révoquées
   */
  async revokeAllUserSessions(userId: string): Promise<number> {
    // Mettre à jour toutes les sessions actives (non révoquées) de l'utilisateur
    const result = await this.prismaClient.session.updateMany({
      where: {
        userId: userId,
        revokedAt: null, // Seulement les sessions actives
      },
      data: {
        revokedAt: new Date(), // Marquer comme révoquée
      },
    });

    // Retourner le nombre de sessions mises à jour
    return result.count;
  }
}
