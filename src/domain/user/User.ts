/**
 * Entité User - Domain Layer
 *
 * Représente un utilisateur du forum avec ses règles métier.
 * Cette entité encapsule la validation business pour garantir
 * que seuls des utilisateurs valides peuvent être créés.
 */

export class User {
  readonly id?: string;
  readonly email: string;
  readonly password: string; // Mot de passe haché
  readonly name?: string;
  readonly avatar?: string;
  readonly bio?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: {
    id?: string;
    email: string;
    password: string;
    name?: string;
    avatar?: string;
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    // Validation des règles métier
    this.validateEmail(props.email);
    this.validatePassword(props.password);
    this.validateName(props.name);

    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.name = props.name;
    this.avatar = props.avatar;
    this.bio = props.bio;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Valide le format de l'email
   * Règles : obligatoire, format RFC 5322, max 255 caractères
   */
  private validateEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error('L\'email est requis');
    }

    if (email.length > 255) {
      throw new Error('L\'email ne peut pas dépasser 255 caractères');
    }

    // Validation format email (RFC 5322 simplifié)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Le format de l\'email est invalide');
    }
  }

  /**
   * Valide la complexité du mot de passe
   * Règles : min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
   *
   * Note : Cette validation s'applique au mot de passe EN CLAIR avant hachage.
   * Si le mot de passe est déjà haché (lors de la reconstruction depuis la DB),
   * cette validation ne s'applique pas car le hash bcrypt est toujours valide.
   */
  private validatePassword(password: string): void {
    if (!password || password.trim().length === 0) {
      throw new Error('Le mot de passe est requis');
    }

    // Si le mot de passe est un hash bcrypt, on ne valide pas
    // (format bcrypt : $2a$10$... ou $2b$10$...)
    const bcryptRegex = /^\$2[aby]\$\d{2}\$.{53}$/;
    if (bcryptRegex.test(password)) {
      return; // C'est déjà un hash, pas de validation supplémentaire
    }

    // Validation pour mot de passe en clair (avant hachage)
    if (password.length < 8) {
      throw new Error('Le mot de passe doit contenir au minimum 8 caractères');
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error('Le mot de passe doit contenir au moins une majuscule');
    }

    if (!/[a-z]/.test(password)) {
      throw new Error('Le mot de passe doit contenir au moins une minuscule');
    }

    if (!/[0-9]/.test(password)) {
      throw new Error('Le mot de passe doit contenir au moins un chiffre');
    }

    // Caractères spéciaux autorisés : !@#$%^&*()_+-=[]{}|;:,.<>?
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      throw new Error('Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*()_+-=[]{}|;:,.<>?)');
    }
  }

  /**
   * Valide le nom d'utilisateur
   * Règles : optionnel, max 100 caractères si fourni
   */
  private validateName(name?: string): void {
    if (name && name.length > 100) {
      throw new Error('Le nom ne peut pas dépasser 100 caractères');
    }
  }
}
