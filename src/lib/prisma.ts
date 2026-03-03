import { PrismaClient } from '@/generated/client/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Forced refresh: 2026-02-06 00:00:00
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

console.log("Prisma: Initialisation avec DATABASE_URL =", process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ":****@"));
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
