/**
 * Implémentation Prisma du RegisterUserRepository
 *
 * Cette classe adapte Prisma pour implémenter l'interface RegisterUserRepository.
 * Pattern : Adapter Pattern
 *
 * Responsabilités :
 * - Mapper l'entité User vers le modèle Prisma
 * - Gérer les opérations de base de données
 * - Traduire les erreurs Prisma en erreurs métier
 *
 * Injection de dépendance :
 * - Accepte un PrismaClient optionnel via le constructeur
 * - Utilise le singleton par défaut si aucun client n'est fourni
 * - Permet l'utilisation d'un client de test pour les tests E2E
 */

import { prisma } from '@/lib/prisma';
import { RegisterUserRepository } from './RegisterUserRepository';
import { User } from '@/domain/user/User';
import { PrismaClient, Prisma } from '@/generated/prisma';

export class RegisterUserPrismaRepository implements RegisterUserRepository {
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
   * Sauvegarde un nouvel utilisateur en base de données
   *
   * @param user - L'entité User à sauvegarder
   * @returns L'ID de l'utilisateur créé
   * @throws Error si l'email existe déjà (violation contrainte unique)
   */
  async save(user: User): Promise<string> {
    try {
      const result = await this.prismaClient.user.create({
        data: {
          email: user.email,
          password: user.password, // Déjà haché par le use case
          name: user.name || null,
        },
      });

      return result.id;
    } catch (error) {
      // Gestion spécifique des erreurs Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 : Violation de contrainte unique (email déjà utilisé)
        if (error.code === 'P2002') {
          throw new Error('Cet email est déjà utilisé');
        }
      }

      // Relancer l'erreur si ce n'est pas une erreur connue
      throw error;
    }
  }

  /**
   * Vérifie si un email est déjà utilisé
   *
   * @param email - L'email à vérifier
   * @returns true si l'email existe déjà, false sinon
   */
  async emailExists(email: string): Promise<boolean> {
    const existingUser = await this.prismaClient.user.findUnique({
      where: { email },
      select: { id: true }, // On ne récupère que l'ID pour optimiser
    });

    return existingUser !== null;
  }
}
