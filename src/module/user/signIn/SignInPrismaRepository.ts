import { prisma } from '@/lib/prisma';
import { SignInRepository } from './SignInRepository';
import { User } from '@/domain/user/User';

/**
 * Adapter Prisma pour SignInRepository
 *
 * Implémente l'interface du repository en utilisant Prisma Client.
 * Convertit les modèles Prisma en entités du domaine.
 */
export class SignInPrismaRepository implements SignInRepository {
  /**
   * Recherche un utilisateur par son adresse email
   *
   * @param email - L'adresse email à rechercher
   * @returns L'entité User du domaine si trouvée, null sinon
   */
  async findByEmail(email: string): Promise<User | null> {
    // Requête en base de données avec Prisma
    const userData = await prisma.user.findUnique({
      where: { email },
    });

    // Utilisateur non trouvé
    if (!userData) {
      return null;
    }

    // Conversion du modèle Prisma vers l'entité du domaine
    // Note : Le mot de passe est déjà haché (format bcrypt)
    // L'entité User détectera le format bcrypt et ne validera pas
    return new User({
      id: userData.id,
      email: userData.email,
      password: userData.password,
      name: userData.name ?? undefined,
    });
  }
}
