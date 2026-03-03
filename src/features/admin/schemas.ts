import { z } from "zod";

export const PromotionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  discount: z.string().min(1, "Discount is required"),
  code: z.string().optional().nullable(),
  expiresAt: z.union([z.date(), z.string(), z.null()]).optional().transform((val) => {
    if (!val) return null;
    return new Date(val);
  }),
  isActive: z.boolean().default(true),
});

export type PromotionInput = z.infer<typeof PromotionSchema>;
