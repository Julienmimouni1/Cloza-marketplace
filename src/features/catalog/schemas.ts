import { z } from 'zod';

export const ProductFilterSchema = z.object({
  category: z.enum(['Textile', 'Beauty', 'Food']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  vendorId: z.string().optional(),
});

export type ProductFilter = z.infer<typeof ProductFilterSchema>;
