import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { PrismaClient } from '@/generated/prisma';
import { UpdateMessageUseCase } from '../UpdateMessageUseCase';
import { UpdateMessagePrismaRepository } from '../UpdateMessagePrismaRepository';

let container: StartedPostgreSqlContainer;
let prisma: PrismaClient;
let useCase: UpdateMessageUseCase;
let repository: UpdateMessagePrismaRepository;

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('test_forum')
    .withUsername('test')
    .withPassword('test')
    .start();

  process.env.DATABASE_URL = container.getConnectionUri();

  prisma = new PrismaClient({
    datasources: {
      db: {
        url: container.getConnectionUri(),
      },
    },
  });

  const { execSync } = require('child_process');
  execSync('npx prisma db push --skip-generate', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: container.getConnectionUri() },
  });

  repository = new UpdateMessagePrismaRepository(prisma);
  useCase = new UpdateMessageUseCase(repository);
}, 60000);

afterAll(async () => {
  await prisma.$disconnect();
  await container.stop();
});

beforeEach(async () => {
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.user.deleteMany();
});

describe('UpdateMessage Integration (E2E - US-7)', () => {
  it("devrait modifier le contenu d'un message en base de données", async () => {
    // Étant donné
    const user = await prisma.user.create({
      data: {
        email: 'author@example.com',
        password: 'hashedPassword',
        name: 'Author',
      },
    });

    const conversation = await prisma.conversation.create({
      data: {
        title: 'Conversation Test',
        authorId: user.id,
      },
    });

    const message = await prisma.message.create({
      data: {
        content: 'Contenu original',
        authorId: user.id,
        conversationId: conversation.id,
      },
    });

    const command = {
      messageId: message.id,
      userId: user.id,
      content: 'Contenu modifié',
    };

    // Quand
    await useCase.execute(command);

    // Alors
    const updatedMessage = await prisma.message.findUnique({
      where: { id: message.id },
    });

    expect(updatedMessage).not.toBeNull();
    expect(updatedMessage!.content).toBe('Contenu modifié');
    expect(updatedMessage!.updatedAt).not.toBeNull();
  });

  it('devrait rejeter un contenu vide', async () => {
    // Étant donné
    const user = await prisma.user.create({
      data: {
        email: 'author@example.com',
        password: 'hashedPassword',
        name: 'Author',
      },
    });

    const conversation = await prisma.conversation.create({
      data: {
        title: 'Conversation Test',
        authorId: user.id,
      },
    });

    const message = await prisma.message.create({
      data: {
        content: 'Contenu original',
        authorId: user.id,
        conversationId: conversation.id,
      },
    });

    // Quand / Alors
    await expect(
      useCase.execute({
        messageId: message.id,
        userId: user.id,
        content: '',
      })
    ).rejects.toThrow('contenu');
  });

  it('devrait rejeter un contenu trop long', async () => {
    // Étant donné
    const user = await prisma.user.create({
      data: {
        email: 'author@example.com',
        password: 'hashedPassword',
        name: 'Author',
      },
    });

    const conversation = await prisma.conversation.create({
      data: {
        title: 'Conversation Test',
        authorId: user.id,
      },
    });

    const message = await prisma.message.create({
      data: {
        content: 'Contenu original',
        authorId: user.id,
        conversationId: conversation.id,
      },
    });

    // Quand / Alors
    await expect(
      useCase.execute({
        messageId: message.id,
        userId: user.id,
        content: 'a'.repeat(2001),
      })
    ).rejects.toThrow('2000 caractères');
  });

  it("devrait rejeter si le message n'existe pas", async () => {
    // Étant donné
    const user = await prisma.user.create({
      data: {
        email: 'user@example.com',
        password: 'hashedPassword',
        name: 'User',
      },
    });

    // Quand / Alors
    await expect(
      useCase.execute({
        messageId: 'msg-404',
        userId: user.id,
        content: 'Contenu modifié',
      })
    ).rejects.toThrow('trouvé');
  });

  it("devrait rejeter si l'utilisateur n'est pas le propriétaire", async () => {
    // Étant donné
    const author = await prisma.user.create({
      data: {
        email: 'author@example.com',
        password: 'hashedPassword',
        name: 'Author',
      },
    });

    const otherUser = await prisma.user.create({
      data: {
        email: 'other@example.com',
        password: 'hashedPassword',
        name: 'Other',
      },
    });

    const conversation = await prisma.conversation.create({
      data: {
        title: 'Conversation Test',
        authorId: author.id,
      },
    });

    const message = await prisma.message.create({
      data: {
        content: 'Contenu original',
        authorId: author.id,
        conversationId: conversation.id,
      },
    });

    // Quand / Alors
    await expect(
      useCase.execute({
        messageId: message.id,
        userId: otherUser.id,
        content: 'Contenu modifié',
      })
    ).rejects.toThrow('autorisé');
  });
});
