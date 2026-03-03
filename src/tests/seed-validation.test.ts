import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('Database Seeding', () => {
  it('should have at least 12 products', async () => {
    const count = await prisma.product.count();
    expect(count).toBeGreaterThanOrEqual(12);
  });

  it('should have realistic images (not default placeholders)', async () => {
    const products = await prisma.product.findMany({ take: 5 });
    if (products.length === 0) return; // Pass if empty, count test covers it. But actually we want to verify content.
    
    // Check if any product has the default image
    const hasDefaultImage = products.some(p => p.image === "https://placehold.co/600x400");
    
    // We expect NO default images for seeded data
    expect(hasDefaultImage).toBe(false);
  });
});
