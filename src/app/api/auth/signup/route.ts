/**
 * API Route : POST /api/auth/signup
 *
 * Endpoint d'inscription d'un nouvel utilisateur (US-9)
 *
 * Responsabilités du contrôleur :
 * - Parser la requête HTTP
 * - Instancier les dépendances (repository, use case)
 * - Exécuter le use case
 * - Mapper le résultat en réponse HTTP
 * - Gérer les erreurs et retourner les bons status codes
 *
 * Status codes :
 * - 201 Created : Inscription réussie
 * - 400 Bad Request : Validation échouée
 * - 409 Conflict : Email déjà utilisé
 * - 500 Internal Server Error : Erreur serveur inattendue
 */

import { NextRequest } from 'next/server';
import { RegisterUserUseCase } from '@/module/user/registerUser/RegisterUserUseCase';
import { RegisterUserPrismaRepository } from '@/module/user/registerUser/RegisterUserPrismaRepository';

export async function POST(request: NextRequest) {
  try {
    // 1. Parser le body de la requête
    const body = await request.json();
    const { email, password, name } = body;

    // 2. Validation basique des champs obligatoires
    if (!email || !password) {
      return Response.json(
        { error: 'L\'email et le mot de passe sont requis' },
        { status: 400 }
      );
    }

    // 3. Instancier le repository et le use case (simple DI)
    const repository = new RegisterUserPrismaRepository();
    const useCase = new RegisterUserUseCase(repository);

    // 4. Exécuter le use case
    const result = await useCase.execute({
      email,
      password,
      name,
    });

    // 5. Retourner une réponse HTTP 201 Created
    return Response.json(
      {
        message: 'Compte créé avec succès',
        user: {
          id: result.userId,
          email: result.email,
          name: result.name ?? null, // Convertir undefined en null pour la réponse JSON
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // 6. Gestion des erreurs
    console.error('Erreur lors de l\'inscription:', error);

    if (error instanceof Error) {
      // Erreur métier : email déjà utilisé (409 Conflict)
      if (error.message.includes('déjà utilisé')) {
        return Response.json(
          { error: error.message },
          { status: 409 }
        );
      }

      // Erreur de validation (400 Bad Request)
      if (
        error.message.includes('email') ||
        error.message.includes('mot de passe') ||
        error.message.includes('nom')
      ) {
        return Response.json(
          { error: error.message },
          { status: 400 }
        );
      }

      // Autres erreurs métier (400 Bad Request)
      return Response.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Erreur serveur inattendue (500 Internal Server Error)
    return Response.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}
