import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';

declare global {
  // eslint-disable-next-line no-var
  var prismaClientGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaClientGlobal ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaClientGlobal = prisma;
}

export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('Connected to PostgreSQL Database via Prisma');
  } catch (error) {
    logger.error('Database connection error:', error);
    // We log and continue so tests and mock services can initialize if needed
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
