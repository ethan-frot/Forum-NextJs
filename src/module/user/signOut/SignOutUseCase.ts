import { SignOutRepository } from "./SignOutRepository";

/**
 * Objet command pour le use case SignOut
 */
export interface SignOutCommand {
  userId: string;
}

/**
 * Objet résultat pour le use case SignOut
 */
export interface SignOutResult {
  success: boolean;
  revokedSessions: number;
}

/**
 * Déconnecte un utilisateur en révoquant toutes ses sessions actives.
 *
 * Règles métier :
 * - Le userId est obligatoire
 * - Révoque toutes les sessions actives de l'utilisateur (définit revokedAt)
 * - Retourne succès même s'il n'y a pas de sessions actives
 * - Les cookies de session seront supprimés par la couche API route
 *
 * @throws Error si la validation échoue
 */
export class SignOutUseCase {
  constructor(private repository: SignOutRepository) {}

  async execute(command: SignOutCommand): Promise<SignOutResult> {
    try {
      // 1. Valider le userId
      this.validateUserId(command.userId);

      // 2. Révoquer toutes les sessions de l'utilisateur
      const revokedCount = await this.repository.revokeAllUserSessions(
        command.userId
      );

      // 3. Retourner le résultat (succès même si aucune session n'a été révoquée)
      return {
        success: true,
        revokedSessions: revokedCount,
      };
    } catch (error) {
      // Erreurs métier : relancer telles quelles
      if (error instanceof Error) {
        throw error;
      }
      // Erreurs inattendues : encapsuler avec contexte
      throw new Error("Impossible de se déconnecter");
    }
  }

  /**
   * Valide l'entrée userId
   * @throws Error si le userId est invalide
   */
  private validateUserId(userId: string): void {
    if (userId === undefined || userId === null) {
      throw new Error("L'identifiant utilisateur (userId) est requis");
    }

    if (typeof userId !== "string" || userId.trim().length === 0) {
      throw new Error("L'identifiant utilisateur (userId) est requis");
    }
  }
}
