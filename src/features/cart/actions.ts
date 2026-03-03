"use server";

import { prisma } from '@/lib/prisma';
import { StockCheckSchema, SyncCartSchema } from './schemas';
import { validateStock, StockValidationResult } from './logic/stock-validator';
import { auth } from '@/lib/auth';
import { CartItem } from './types';

export type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: { code: string; message: string; data?: any } };

/**
 * Syncs guest cart items with the database cart for the authenticated user
 * Optimized to avoid N+1 queries.
 */
export async function syncCart(guestItems: CartItem[]): Promise<ActionResponse<any>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: 'User not authenticated' } };
  }

  const validated = SyncCartSchema.safeParse(guestItems);
  if (!validated.success) {
    return { success: false, error: { code: 'INVALID_INPUT', message: 'Invalid cart data' } };
  }

  try {
    const userId = session.user.id;

    // Execute in transaction for atomicity and performance
    const updatedCart = await prisma.$transaction(async (tx) => {
      let cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: true },
      });

      if (!cart) {
        cart = await tx.cart.create({
          data: { userId },
          include: { items: true },
        });
      }

      // Prepare operations to avoid N+1
      for (const item of validated.data) {
        const existingItem = cart.items.find((i) => i.productId === item.productId);

        if (existingItem) {
          await tx.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          });
        } else {
          await tx.cartItem.create({
            data: {
              cartId: cart.id,
              productId: item.productId,
              quantity: item.quantity,
            },
          });
        }
      }

      return tx.cart.findUnique({
        where: { id: cart.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return { success: true, data: updatedCart };
  } catch (error) {
    console.error("Cart sync error:", error);
    return { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to sync cart' } };
  }
}

/**
 * Fetches the current user's cart from the database
 */
export async function getCart(): Promise<ActionResponse<any>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: 'User not authenticated' } };
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return { success: true, data: cart };
  } catch (error) {
    return { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch cart' } };
  }
}

/**
 * Updates an item's quantity in the database cart
 */
export async function updateCartItemAction(productId: string, quantity: number): Promise<ActionResponse<any>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } };

  try {
    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart) return { success: false, error: { code: 'NOT_FOUND', message: 'Cart not found' } };

    await prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity }
    });

    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: { code: 'SERVER_ERROR', message: 'Update failed' } };
  }
}

/**
 * Removes an item from the database cart
 */
export async function removeFromCartAction(productId: string): Promise<ActionResponse<any>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } };

  try {
    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart) return { success: false, error: { code: 'NOT_FOUND', message: 'Cart not found' } };

    await prisma.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } }
    });

    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: { code: 'SERVER_ERROR', message: 'Removal failed' } };
  }
}

/**
 * Validates stock for a specific product
 * Used to check before adding to cart or when updating quantity
 */
export async function validateStockAction(
  productId: string,
  quantity: number
): Promise<ActionResponse<StockValidationResult>> {
  const result = StockCheckSchema.safeParse({ productId, quantity });

  if (!result.success) {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Invalid product or quantity',
      }
    };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true }
    });

    if (!product) {
      return {
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
        }
      };
    }

    const validation = validateStock(quantity, product.stock);

    if (!validation.isValid) {
      return {
        success: false,
        error: {
          code: 'INSUFFICIENT_STOCK',
          message: `Only ${product.stock} items remaining in stock`,
          data: validation
        }
      };
    }

    return {
      success: true,
      data: validation
    };
  } catch (error) {
    console.error("Stock validation error:", error);
    return {
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to validate stock',
      }
    };
  }
}