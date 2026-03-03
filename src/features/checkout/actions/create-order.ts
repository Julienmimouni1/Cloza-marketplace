'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const CreateOrderSchema = z.string().cuid();

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export async function createOrderFromCart(
  cartId: string,
  paymentIntentId: string
): Promise<ActionResponse<any>> {
  try {
    // 1. Fetch Global Commission Rate (Default 1500 bps = 15%)
    const globalRateSetting = await prisma.systemSetting.findUnique({
      where: { key: "GLOBAL_COMMISSION_RATE" },
    });
    const globalRate = globalRateSetting ? parseInt(globalRateSetting.value, 10) : 1500;

    // 2. Fetch Cart and Items with Product/Vendor info
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: {
              include: {
                vendor: {
                  select: { commissionRate: true }
                }
              }
            },
          },
        },
      },
    });

    if (!cart) {
      return { success: false, error: { code: 'CART_NOT_FOUND', message: 'Cart not found' } };
    }

    if (cart.items.length === 0) {
      return { success: false, error: { code: 'CART_EMPTY', message: 'Cart is empty' } };
    }

    // 3. Validate Stock and Calculate Totals
    let grandTotal = 0;
    const vendorGroups: Record<string, { items: typeof cart.items; total: number; commissionRate: number | null }> = {};

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return {
          success: false,
          error: {
            code: 'INSUFFICIENT_STOCK',
            message: `Not enough stock for product ${item.product.name}`,
          },
        };
      }

      const itemTotal = item.product.priceHt * item.quantity;
      grandTotal += itemTotal;

      const vendorId = item.product.vendorId;
      if (!vendorGroups[vendorId]) {
        vendorGroups[vendorId] = { 
          items: [], 
          total: 0,
          commissionRate: item.product.vendor.commissionRate 
        };
      }
      vendorGroups[vendorId].items.push(item);
      vendorGroups[vendorId].total += itemTotal;
    }

    // 4. Create Order Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 4.1 Create Parent Order
      const parentOrder = await tx.order.create({
        data: {
          buyerId: cart.userId,
          totalAmount: grandTotal,
          paymentIntentId: paymentIntentId,
          paymentMethod: 'CARD', // Default for now
          status: 'PAID', // Assuming direct capture for this phase
          subOrders: {
            create: Object.entries(vendorGroups).map(([vendorId, group]) => {
              const appliedRate = group.commissionRate ?? globalRate;
              const commission = Math.round((group.total * appliedRate) / 10000);

              return {
                vendorId: vendorId,
                totalAmount: group.total,
                commissionAmount: commission,
                commissionRateApplied: appliedRate,
                status: 'CONFIRMED', // Paid and ready for vendor
                items: {
                  create: group.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    priceAtPurchase: item.product.priceHt,
                  })),
                },
              };
            }),
          },
        },
        include: {
          subOrders: {
            include: {
              items: true,
            },
          },
        },
      });

      // 4.2 Clear Cart
      await tx.cart.delete({
        where: { id: cartId },
      });

      // 4.3 Decrement Stock (Optimistic Locking not implemented yet)
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return parentOrder;
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Order creation failed:', error);
    return {
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to process order' },
    };
  }
}
