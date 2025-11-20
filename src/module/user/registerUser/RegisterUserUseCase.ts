/**
 * Use Case : Inscription d'un utilisateur (US-9)
 *
 * Responsabilités :
 * - Valider les données d'inscription
 * - Vérifier que l'email n'existe pas déjà
 * - Hacher le mot de passe avec bcrypt (10 salt rounds)
 * - Créer l'entité User
 * - Sauvegarder l'utilisateur via le repository
 *
 * Règles métier (conformément aux specs) :
 * - Email obligatoire, format valide, unique, max 255 caractères
 * - Mot de passe obligatoire, min 8 caractères, avec complexité
 * - Name optionnel, max 100 caractères
 * - Retourne 409 Conflict si email existe déjà
 */

import { RegisterUserRepository } from './RegisterUserRepository';
import { User } from '@/domain/user/User';
import { hashPassword } from '@/lib/password';

/**
 * Commande d'inscription
 * Représente les données envoyées par l'utilisateur
 */
export interface RegisterUserCommand {
  email: string;
  password: string; // Mot de passe en clair
  name?: string;
}

/**
 * Résultat de l'inscription
 * Représente la réponse retournée après une inscription réussie
 */
export interface RegisterUserResult {
  userId: string;
  email: string;
  name?: string;
}

export class RegisterUserUseCase {
  constructor(private repository: RegisterUserRepository) {}

  /**
   * Exécute le use case d'inscription
   *
   * @param command - Les données d'inscription
   * @returns Le résultat de l'inscription avec l'ID de l'utilisateur créé
   * @throws Error si l'email existe déjà ou si validation échoue
   */
  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    try {
      // 1. Vérifier que l'email n'existe pas déjà
      const emailAlreadyExists = await this.repository.emailExists(command.email);
      if (emailAlreadyExists) {
        throw new Error('Cet email est déjà utilisé');
      }

      // 2. Créer l'entité User avec le mot de passe en clair pour déclencher la validation
      // La validation business se fait dans le constructeur de User
      const user = new User({
        email: command.email,
        password: command.password, // Mot de passe en clair - validation se déclenchera
        name: command.name,
      });

      // 3. Maintenant que la validation a réussi, hacher le mot de passe
      const hashedPassword = await hashPassword(command.password);

      // 4. Créer une nouvelle instance User avec le mot de passe haché pour la sauvegarde
      const userToSave = new User({
        email: user.email,
        password: hashedPassword,
        name: user.name,
      });

      // 5. Sauvegarder l'utilisateur via le repository
      const userId = await this.repository.save(userToSave);

      // 6. Retourner le résultat (avec les données de l'utilisateur original, pas le hash)
      return {
        userId,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      // Wrapper les erreurs avec contexte
      if (error instanceof Error) {
        // Si c'est déjà une erreur métier, la relancer telle quelle
        if (
          error.message.includes('email') ||
          error.message.includes('mot de passe') ||
          error.message.includes('nom')
        ) {
          throw error;
        }

        // Sinon, wrapper avec contexte
        throw new Error(`Impossible de créer le compte : ${error.message}`);
      }

      throw error;
    }
  }
}
