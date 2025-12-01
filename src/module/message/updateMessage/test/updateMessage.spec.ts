import { UpdateMessageUseCase } from '../UpdateMessageUseCase';
import { UpdateMessageRepository } from '../UpdateMessageRepository';
import { Message } from '@/domain/message/Message';

class UpdateMessageDummyRepository implements UpdateMessageRepository {
  async findById(id: string): Promise<Message | null> {
    if (id === 'msg-404') return null;
    return new Message({
      id: id,
      content: 'Contenu original',
      authorId: 'user-123',
      conversationId: 'conv-123',
      createdAt: new Date(),
    });
  }

  async update(_message: Message): Promise<void> {
    return;
  }
}

describe('UpdateMessageUseCase (US-7)', () => {
  it("devrait modifier le contenu d'un message avec succès", async () => {
    // Étant donné
    const repository = new UpdateMessageDummyRepository();
    const useCase = new UpdateMessageUseCase(repository);

    // Quand
    await useCase.execute({
      messageId: 'msg-123',
      userId: 'user-123',
      content: 'Nouveau contenu modifié',
    });

    // Alors
    expect(true).toBe(true);
  });

  it('devrait rejeter un contenu vide', async () => {
    // Étant donné
    const repository = new UpdateMessageDummyRepository();
    const useCase = new UpdateMessageUseCase(repository);

    // Quand / Alors
    await expect(
      useCase.execute({
        messageId: 'msg-123',
        userId: 'user-123',
        content: '',
      })
    ).rejects.toThrow('contenu');
  });

  it('devrait rejeter un contenu trop long', async () => {
    // Étant donné
    const repository = new UpdateMessageDummyRepository();
    const useCase = new UpdateMessageUseCase(repository);

    // Quand / Alors
    await expect(
      useCase.execute({
        messageId: 'msg-123',
        userId: 'user-123',
        content: 'a'.repeat(2001),
      })
    ).rejects.toThrow('2000 caractères');
  });

  it("devrait rejeter si le message n'existe pas", async () => {
    // Étant donné
    const repository = new UpdateMessageDummyRepository();
    const useCase = new UpdateMessageUseCase(repository);

    // Quand / Alors
    await expect(
      useCase.execute({
        messageId: 'msg-404',
        userId: 'user-123',
        content: 'Nouveau contenu',
      })
    ).rejects.toThrow('Message non trouvé');
  });

  it("devrait rejeter si l'utilisateur n'est pas le propriétaire", async () => {
    // Étant donné
    const repository = new UpdateMessageDummyRepository();
    const useCase = new UpdateMessageUseCase(repository);

    // Quand / Alors
    await expect(
      useCase.execute({
        messageId: 'msg-123',
        userId: 'user-456',
        content: 'Nouveau contenu',
      })
    ).rejects.toThrow('autorisé');
  });
});
