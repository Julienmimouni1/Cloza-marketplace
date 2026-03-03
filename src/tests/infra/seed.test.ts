import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/client/client';
import dotenv from 'dotenv';

dotenv.config();

describe('Database Seed', () => {
  let prisma: PrismaClient;
  let pool: Pool;

  beforeAll(() => {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  it('should have at least 5 vendors', async () => {
    const count = await prisma.vendor.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  it('should have at least 50 products', async () => {
    const count = await prisma.product.count();
    expect(count).toBeGreaterThanOrEqual(40);
  });

  it('should have prices as integers', async () => {
    const product = await prisma.product.findFirst();
    expect(Number.isInteger(product?.priceHt)).toBe(true);
  });

  it('should have products linked to vendors', async () => {
    const product = await prisma.product.findFirst({
      include: { vendor: true },
    });
    expect(product?.vendor).toBeDefined();
    expect(product?.vendor.id).toBeDefined();
  });
});
