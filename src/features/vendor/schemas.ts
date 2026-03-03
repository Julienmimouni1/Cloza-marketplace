import { z } from "zod";
import { ProductStatus, Category } from "@/generated/client";

export const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional().or(z.literal("")),
  priceHt: z.coerce.number().min(0, "Le prix ne peut pas être négatif"),
  discountPrice: z.coerce.number().min(0, "Le prix remisé ne peut pas être négatif").optional().nullable(),
  taxRate: z.coerce.number().min(0, "Le taux de taxe ne peut pas être négatif").optional().nullable(),
  stock: z.coerce.number().int().min(0, "Le stock ne peut pas être négatif"),
  category: z.nativeEnum(Category),
  subCategory: z.string().optional().nullable(),
  leafCategory: z.string().optional().nullable(),
  sku: z.string().optional(),
  
  // Shipping
  weight: z.coerce.number().min(0, "Le poids ne peut pas être négatif").optional().nullable(),
  height: z.coerce.number().min(0, "La hauteur ne peut pas être négatif").optional().nullable(),
  width: z.coerce.number().min(0, "La largeur ne peut pas être négatif").optional().nullable(),
  length: z.coerce.number().min(0, "La longueur ne peut pas être négatif").optional().nullable(),
  
  // Attributes
  material: z.string().optional().nullable(),
  origin: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  
  // Images
  images: z.array(z.object({
    url: z.string().url(),
    isMain: z.boolean().default(false),
    order: z.number().int().default(0),
  })).default([]),

  status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
});

export type ProductInput = z.infer<typeof productSchema>;

