import { z } from 'zod';

export const StockCheckSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive(),
});

export const CartItemSchema = z.object({
  id: z.string(),
  variantId: z.string(),
  productId: z.string().cuid(),
  vendorId: z.string(),
  title: z.string(),
  priceHT: z.number().int(),
  vatRate: z.number(),
  quantity: z.number().int().positive(),
  stock: z.number().int(),
  image: z.string().url(),
});

export const SyncCartSchema = z.array(CartItemSchema);

export type StockCheckInput = z.infer<typeof StockCheckSchema>;
export type CartItemInput = z.infer<typeof CartItemSchema>;
