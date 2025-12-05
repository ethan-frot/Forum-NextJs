import { GetUserContributionsUseCase } from '../GetUserContributionsUseCase';
import { UserContributions } from '../types/getUserContributions.types';

class GetUserContributionsDummyRepository {
  private mockData: UserContributions | null;

  constructor(mockData: UserContributions | null = null) {
    this.mockData = mockData;
  }

  async findUserContributions(
    _userId: string
  ): Promise<UserContributions | null> {
    return this.mockData;
  }
}

describe('GetUserContributionsUseCase (US-14)', () => {
  it("devrait retourner les contributions d'un utilisateur avec succès", async () => {
    // Étant donné
    const mockContributions: UserContributions = {
      user: {
        id: 'user-123',
        name: 'Alice Dupont',
        avatar: null,
        bio: null,
        createdAt: new Date('2025-01-01'),
      },
      conversations: [
        {
          id: 'conv-1',
          title: 'Conversation 1',
          createdAt: new Date('2025-01-02'),
          updatedAt: new Date('2025-01-02'),
          messageCount: 5,
        },
        {
          id: 'conv-2',
          title: 'Conversation 2',
          createdAt: new Date('2025-01-03'),
          updatedAt: new Date('2025-01-03'),
          messageCount: 3,
        },
      ],
      messages: [
        {
          id: 'msg-1',
          content: 'Message 1',
          createdAt: new Date('2025-01-04'),
          updatedAt: new Date('2025-01-04'),
          conversationId: 'conv-3',
          conversationTitle: 'Autre conversation',
        },
      ],
    };

    const repository = new GetUserContributionsDummyRepository(
      mockContributions
    );
    const useCase = new GetUserContributionsUseCase(repository);

    // Quand
    const result = await useCase.execute('user-123');

    // Alors
    expect(result).toBeDefined();
    expect(result.user.id).toBe('user-123');
    expect(result.user.name).toBe('Alice Dupont');
    expect(result.conversations).toHaveLength(2);
    expect(result.messages).toHaveLength(1);
    expect(result.user).not.toHaveProperty('email');
    expect(result.user).not.toHaveProperty('password');
  });

  it("devrait retourner les contributions vides si l'utilisateur n'a rien créé", async () => {
    // Étant donné
    const mockContributions: UserContributions = {
      user: {
        id: 'user-456',
        name: 'Bob Martin',
        avatar: null,
        bio: null,
        createdAt: new Date('2025-01-01'),
      },
      conversations: [],
      messages: [],
    };

    const repository = new GetUserContributionsDummyRepository(
      mockContributions
    );
    const useCase = new GetUserContributionsUseCase(repository);

    // Quand
    const result = await useCase.execute('user-456');

    // Alors
    expect(result.user.id).toBe('user-456');
    expect(result.conversations).toEqual([]);
    expect(result.messages).toEqual([]);
  });

  it("devrait lever une erreur si l'utilisateur n'existe pas", async () => {
    // Étant donné
    const repository = new GetUserContributionsDummyRepository(null);
    const useCase = new GetUserContributionsUseCase(repository);

    // Quand / Alors
    await expect(useCase.execute('user-999')).rejects.toThrow(
      'Utilisateur non trouvé'
    );
  });

  it("ne devrait jamais exposer l'email ou le mot de passe", async () => {
    // Étant donné
    const mockContributions: UserContributions = {
      user: {
        id: 'user-123',
        name: 'Alice Dupont',
        avatar: null,
        bio: null,
        createdAt: new Date('2025-01-01'),
      },
      conversations: [],
      messages: [],
    };

    const repository = new GetUserContributionsDummyRepository(
      mockContributions
    );
    const useCase = new GetUserContributionsUseCase(repository);

    // Quand
    const result = await useCase.execute('user-123');

    // Alors
    expect(result.user).not.toHaveProperty('email');
    expect(result.user).not.toHaveProperty('password');
  });
});
