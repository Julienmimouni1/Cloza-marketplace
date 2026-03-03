import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { createOrderFromCart } from '@/features/checkout/actions/create-order';

// Mock Prisma to avoid real DB calls during initial logic validation
vi.mock('@/lib/prisma', () => ({
  prisma: {
    cart: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    order: {
      create: vi.fn(),
    },
    product: {
      findUnique: vi.fn(),
      update: vi.fn(), // Added this line
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}));

describe('Multi-Vendor Order Splitting Logic', () => {
  const mockBuyerId = 'buyer-123';
  const mockCartId = 'cart-abc';

  const mockVendor1 = 'vendor-1';
  const mockVendor2 = 'vendor-2';

  const mockCartItems = [
    {
      id: 'item-1',
      productId: 'prod-A',
      quantity: 1,
      product: { id: 'prod-A', priceHt: 1000, vendorId: mockVendor1, stock: 10 },
    },
    {
      id: 'item-2',
      productId: 'prod-B',
      quantity: 2,
      product: { id: 'prod-B', priceHt: 2000, vendorId: mockVendor1, stock: 5 },
    },
    {
      id: 'item-3',
      productId: 'prod-C',
      quantity: 1,
      product: { id: 'prod-C', priceHt: 5000, vendorId: mockVendor2, stock: 2 },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should split a mixed cart into correct SubOrders per vendor', async () => {
    // Setup Mock Returns
    (prisma.cart.findUnique as any).mockResolvedValue({
      id: mockCartId,
      userId: mockBuyerId,
      items: mockCartItems,
    });

    (prisma.order.create as any).mockResolvedValue({
      id: 'order-master-1',
      totalAmount: 10000, // (1000*1) + (2000*2) + (5000*1)
    });

    // Execute Action
    const result = await createOrderFromCart(mockCartId, 'payment-intent-xyz');

    // Assertions
    expect(result.success).toBe(true);

    // Check Order Creation structure
    const createCallArgs = (prisma.order.create as any).mock.calls[0][0];
    
    expect(createCallArgs.data).toMatchObject({
      buyerId: mockBuyerId,
      totalAmount: 10000,
      paymentIntentId: 'payment-intent-xyz',
    });

    // CRITICAL: Check SubOrders Splitting
    const subOrders = createCallArgs.data.subOrders.create;
    expect(subOrders).toHaveLength(2); // Should be 2 vendors

    // Vendor 1 SubOrder
    const v1Order = subOrders.find((so: any) => so.vendorId === mockVendor1);
    expect(v1Order).toBeDefined();
    expect(v1Order.totalAmount).toBe(5000); // 1000 + 4000
    expect(v1Order.items.create).toHaveLength(2);

    // Vendor 2 SubOrder
    const v2Order = subOrders.find((so: any) => so.vendorId === mockVendor2);
    expect(v2Order).toBeDefined();
    expect(v2Order.totalAmount).toBe(5000); // 5000
    expect(v2Order.items.create).toHaveLength(1);
  });

  it('should throw error if stock is insufficient', async () => {
     // Setup Mock with low stock
     (prisma.cart.findUnique as any).mockResolvedValue({
      id: mockCartId,
      userId: mockBuyerId,
      items: [{
        ...mockCartItems[0],
        quantity: 20, // Requesting 20, have 10
      }],
    });

    const result = await createOrderFromCart(mockCartId, 'pi_123');
    expect(result.success).toBe(false);
    if (!result.success) {
        expect(result.error).toBeDefined();
    }
    expect(prisma.order.create).not.toHaveBeenCalled();
  });
});
