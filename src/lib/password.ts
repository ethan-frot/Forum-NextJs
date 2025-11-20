/**
 * Utilitaires pour la gestion des mots de passe
 *
 * Fournit des fonctions pour hacher et vérifier les mots de passe
 * en utilisant bcrypt avec 10 salt rounds (conformément aux specs US-9)
 */

import bcrypt from 'bcryptjs';

/**
 * Nombre de salt rounds pour bcrypt (conformément aux spécifications)
 */
const SALT_ROUNDS = 10;

/**
 * Hache un mot de passe en clair avec bcrypt
 *
 * @param plainPassword - Le mot de passe en clair à hacher
 * @returns Le mot de passe haché (format bcrypt)
 * @throws Error si le mot de passe est vide
 *
 * @example
 * const hashedPassword = await hashPassword('SecureP@ss123');
 * // Retourne: $2a$10$...
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  if (!plainPassword || plainPassword.trim().length === 0) {
    throw new Error('Le mot de passe ne peut pas être vide');
  }

  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Vérifie si un mot de passe en clair correspond à un hash bcrypt
 *
 * @param plainPassword - Le mot de passe en clair à vérifier
 * @param hashedPassword - Le hash bcrypt à comparer
 * @returns true si le mot de passe correspond, false sinon
 *
 * @example
 * const isValid = await verifyPassword('SecureP@ss123', storedHash);
 * if (isValid) {
 *   console.log('Mot de passe correct');
 * }
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  if (!plainPassword || !hashedPassword) {
    return false;
  }

  return bcrypt.compare(plainPassword, hashedPassword);
}
