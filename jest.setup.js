/**
 * Setup global pour les tests Jest
 *
 * Ce fichier est exécuté avant chaque fichier de test.
 * Utilisé pour configurer l'environnement de test global.
 */

// Désactiver les logs console pendant les tests pour un output plus propre
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(), // Désactive console.error pendant les tests
};

// Configuration des timeouts pour les tests E2E (testcontainers)
jest.setTimeout(60000); // 60 secondes

/**
 * Mock global de better-auth pour les tests
 *
 * Better-auth utilise des modules ESM que Jest ne peut pas transformer correctement.
 * Ce mock permet aux tests E2E de s'exécuter sans dépendre du vrai module.
 */
jest.mock('better-auth', () => ({
  betterAuth: jest.fn(() => ({
    api: {
      getSession: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
    },
    handler: jest.fn(),
  })),
}));

/**
 * Mock de better-auth/adapters/prisma
 */
jest.mock('better-auth/adapters/prisma', () => ({
  prismaAdapter: jest.fn(() => ({})),
}));
