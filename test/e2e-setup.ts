import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { PrismaClient } from '@/generated/prisma';
import { execSync } from 'child_process';

export interface E2ETestContext {
  container: StartedPostgreSqlContainer;
  prisma: PrismaClient;
}

export async function setupE2EDatabase(): Promise<E2ETestContext> {
  const container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('test_forum')
    .withUsername('test')
    .withPassword('test')
    .start();

  const databaseUrl = container.getConnectionUri();
  process.env.DATABASE_URL = databaseUrl;

  execSync('npx prisma db push --skip-generate', {
    stdio: 'pipe',
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });

  const prisma = new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
  });

  return { container, prisma };
}

export async function cleanDatabase(prisma: PrismaClient): Promise<void> {
  // Ordre important : respecter les contraintes de clés étrangères
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
}

export async function teardownE2EDatabase(
  context: E2ETestContext
): Promise<void> {
  await context.prisma.$disconnect();
  await context.container.stop();
}
