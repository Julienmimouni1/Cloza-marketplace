import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProducts, getProductBySlug } from './actions';
import { prisma } from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe('Catalog Actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getProducts', () => {
    it('returns products when filters are valid', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          priceHt: 100,
          image: 'img1.jpg',
          category: 'Textile',
          slug: 'p1',
          vendorId: 'v1',
          vendor: { name: 'Vendor 1' },
        },
      ];

      vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);

      const result = await getProducts({});

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: '1',
        title: 'Product 1',
        price: 100,
        image: 'img1.jpg',
        category: 'Textile',
        slug: 'p1',
        vendorId: 'v1',
        vendor: { name: 'Vendor 1' },
      });
    });

    it('filters by category', async () => {
      vi.mocked(prisma.product.findMany).mockResolvedValue([]);

      await getProducts({ category: 'Textile' });

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: 'Textile',
          }),
        })
      );
    });

    it('returns empty array on error', async () => {
      vi.mocked(prisma.product.findMany).mockRejectedValue(new Error('DB Error'));

      const result = await getProducts({});
      expect(result).toEqual([]);
    });
  });

  describe('getProductBySlug', () => {
    it('returns product details when found', async () => {
      const mockProduct = {
        id: '1',
        name: 'My Product',
        description: 'Desc',
        priceHt: 200,
        stock: 10,
        category: 'Textile',
        image: 'img.jpg',
        slug: 'p1',
        vendorId: 'v1',
        vendor: { name: 'V1', id: 'v1' },
      };

      vi.mocked(prisma.product.findUnique).mockResolvedValue(mockProduct as any);

      const result = await getProductBySlug('my-product');

      expect(result).toEqual({
        id: '1',
        title: 'My Product',
        description: 'Desc',
        price: 200,
        stock: 10,
        category: 'Textile',
        image: 'img.jpg',
        slug: 'p1',
        vendorId: 'v1',
        vendor: { name: 'V1', id: 'v1' },
      });
    });

    it('returns null when product not found', async () => {
      vi.mocked(prisma.product.findUnique).mockResolvedValue(null);

      const result = await getProductBySlug('unknown');
      expect(result).toBeNull();
    });

    it('returns null on db error', async () => {
      vi.mocked(prisma.product.findUnique).mockRejectedValue(new Error('DB Error'));

      const result = await getProductBySlug('slug');
      expect(result).toBeNull();
    });
  });
});