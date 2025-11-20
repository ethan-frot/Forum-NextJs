/**
 * Repository Interface pour l'inscription d'un utilisateur
 *
 * Cette interface définit le contrat que doit respecter
 * toute implémentation de repository pour l'inscription.
 *
 * Pattern : Interface Segregation Principle (ISP)
 * Chaque use case a son propre repository interface avec uniquement
 * les méthodes nécessaires.
 */

import { User } from '@/domain/user/User';

export interface RegisterUserRepository {
  /**
   * Sauvegarde un nouvel utilisateur en base de données
   *
   * @param user - L'entité User à sauvegarder
   * @returns L'ID de l'utilisateur créé (CUID)
   * @throws Error si l'email existe déjà (violation contrainte unique)
   */
  save(user: User): Promise<string>;

  /**
   * Vérifie si un email est déjà utilisé
   *
   * @param email - L'email à vérifier
   * @returns true si l'email existe déjà, false sinon
   */
  emailExists(email: string): Promise<boolean>;
}
