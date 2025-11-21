import { SignInRepository } from "./SignInRepository";
import * as bcrypt from "bcryptjs";

/**
 * Command object for SignIn use case
 */
export interface SignInCommand {
  email: string;
  password: string;
}

/**
 * Result object for SignIn use case
 * Note: Password is NEVER returned for security reasons
 */
export interface SignInResult {
  userId: string;
  email: string;
  name?: string;
}

/**
 * Authenticates a user with email and password.
 *
 * Business rules:
 * - Email and password are required
 * - Email must exist in database
 * - Password must match the hashed password (bcrypt comparison)
 * - Returns user info WITHOUT password
 *
 * @throws Error if validation fails or credentials are incorrect
 */
export class SignInUseCase {
  constructor(private repository: SignInRepository) {}

  async execute(command: SignInCommand): Promise<SignInResult> {
    try {
      // 1. Validate inputs
      this.validateEmail(command.email);
      this.validatePassword(command.password);

      // 2. Find user by email
      const user = await this.repository.findByEmail(command.email);

      if (!user) {
        // Security: Don't reveal if email exists or not
        throw new Error("Email ou mot de passe incorrect");
      }

      // 3. Verify password with bcrypt
      const isPasswordValid = await bcrypt.compare(
        command.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error("Email ou mot de passe incorrect");
      }

      // 4. Return user info (WITHOUT password)
      return {
        userId: user.id!,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      // Business errors: rethrow as-is
      if (error instanceof Error) {
        throw error;
      }
      // Unexpected errors: wrap with context
      throw new Error("Impossible de se connecter");
    }
  }

  /**
   * Validate email input
   * @throws Error if email is invalid
   */
  private validateEmail(email: string): void {
    if (email === undefined || email === null) {
      throw new Error("L'email est requis");
    }

    if (typeof email !== "string" || email.trim().length === 0) {
      throw new Error("L'email est requis");
    }
  }

  /**
   * Validate password input
   * @throws Error if password is invalid
   */
  private validatePassword(password: string): void {
    if (password === undefined || password === null) {
      throw new Error("Le mot de passe est requis");
    }

    if (typeof password !== "string" || password.trim().length === 0) {
      throw new Error("Le mot de passe est requis");
    }
  }
}
