import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Autoriser les variables préfixées avec _ (convention pour variables intentionnellement non utilisées)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Fichiers générés
    "src/generated/**",
    "node_modules/**",
    "coverage/**",
    ".husky/**",
    // Fichiers de configuration et tests
    "jest.config.js",
    "**/*.e2e.spec.ts",
  ]),
]);

export default eslintConfig;
