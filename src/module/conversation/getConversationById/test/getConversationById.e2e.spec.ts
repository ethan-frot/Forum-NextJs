import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { PrismaClient } from '@/generated/prisma';
import { GetConversationByIdUseCase } from '../GetConversationByIdUseCase';
import { GetConversationByIdPrismaRepository } from '../GetConversationByIdPrismaRepository';

let container: StartedPostgreSqlContainer;
let prisma: PrismaClient;
let useCase: GetConversationByIdUseCase;
let repository: GetConversationByIdPrismaRepository;

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

  repository = new GetConversationByIdPrismaRepository(prisma);
  useCase = new GetConversationByIdUseCase(repository);
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

describe('GetConversationById Integration (E2E - US-3)', () => {
  it('devrait récupérer une conversation avec ses messages triés chronologiquement', async () => {
    // Étant donné
    const user1 = await prisma.user.create({
      data: {
        email: 'alice@example.com',
        password: 'hashedPassword',
        name: 'Alice',
      },
    });

    const user2 = await prisma.user.create({
      data: {
        email: 'bob@example.com',
        password: 'hashedPassword',
        name: 'Bob',
      },
    });

    const conversation = await prisma.conversation.create({
      data: {
        title: 'Ma conversation',
        authorId: user1.id,
      },
    });

    await prisma.message.create({
      data: {
        content: 'Premier message',
        conversationId: conversation.id,
        authorId: user1.id,
        createdAt: new Date('2024-01-01T10:00:00Z'),
      },
    });

    await prisma.message.create({
      data: {
        content: 'Deuxième message',
        conversationId: conversation.id,
        authorId: user2.id,
        createdAt: new Date('2024-01-01T10:05:00Z'),
      },
    });

    await prisma.message.create({
      data: {
        content: 'Troisième message',
        conversationId: conversation.id,
        authorId: user1.id,
        createdAt: new Date('2024-01-01T10:10:00Z'),
      },
    });

    // Quand
    const result = await useCase.execute(conversation.id);

    // Alors
    expect(result).toBeDefined();
    expect(result.id).toBe(conversation.id);
    expect(result.title).toBe('Ma conversation');
    expect(result.authorId).toBe(user1.id);
    expect(result.author.name).toBe('Alice');
    expect(result.author.email).toBe('alice@example.com');
    expect(result.messages).toHaveLength(3);
    expect(result.messages[0].content).toBe('Premier message');
    expect(result.messages[0].author.name).toBe('Alice');
    expect(result.messages[1].content).toBe('Deuxième message');
    expect(result.messages[1].author.name).toBe('Bob');
    expect(result.messages[2].content).toBe('Troisième message');
    expect(result.messages[2].author.name).toBe('Alice');
  });

  it('devrait rejeter une conversation inexistante', async () => {
    // Étant donné (aucune conversation avec cet ID)
    const fakeId = 'conv-999';

    // Quand / Alors
    await expect(useCase.execute(fakeId)).rejects.toThrow(
      'Conversation non trouvée'
    );
  });

  it('devrait rejeter une conversation supprimée', async () => {
    // Étant donné
    const user = await prisma.user.create({
      data: {
        email: 'charlie@example.com',
        password: 'hashedPassword',
        name: 'Charlie',
      },
    });

    const conversation = await prisma.conversation.create({
      data: {
        title: 'Conversation supprimée',
        authorId: user.id,
        deletedAt: new Date(),
      },
    });

    // Quand / Alors
    await expect(useCase.execute(conversation.id)).rejects.toThrow(
      'Conversation non trouvée'
    );
  });

  it('devrait exclure les messages supprimés', async () => {
    // Étant donné
    const user = await prisma.user.create({
      data: {
        email: 'dave@example.com',
        password: 'hashedPassword',
        name: 'Dave',
      },
    });

    const conversation = await prisma.conversation.create({
      data: {
        title: 'Conversation avec messages supprimés',
        authorId: user.id,
      },
    });

    await prisma.message.create({
      data: {
        content: 'Message actif',
        conversationId: conversation.id,
        authorId: user.id,
        deletedAt: null,
      },
    });

    await prisma.message.create({
      data: {
        content: 'Message supprimé',
        conversationId: conversation.id,
        authorId: user.id,
        deletedAt: new Date(),
      },
    });

    // Quand
    const result = await useCase.execute(conversation.id);

    // Alors
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].content).toBe('Message actif');
  });
});
