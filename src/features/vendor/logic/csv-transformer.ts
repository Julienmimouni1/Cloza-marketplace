import { ProductStatus, Category } from "@/generated/client";
import { z } from "zod";
import { productSchema } from "../schemas";
import { randomUUID } from "crypto";

export interface CsvRow {
  [key: string]: string;
}

export type TransformResult = {
  success: boolean;
  data?: any; // Will be validated by Zod later, but structured as Input
  error?: string;
  sku?: string;
};

// Helper to clean numeric strings (handle 1,000.00 or 1.000,00)
export const parseLocaleNumber = (val: any): number => {
  if (typeof val === 'number') return val;
  if (typeof val !== 'string') return 0;
  
  // Remove spaces
  let clean = val.replace(/\s/g, '');
  
  // Check for comma as decimal separator (e.g. 10,50 -> 10.50)
  // Heuristic: if comma is present and dot is NOT present, replace comma with dot.
  // If both are present, assume dot is thousands separator if it comes before comma (1.000,00) -> remove dot, replace comma.
  // If comma comes before dot (1,000.00) -> remove comma.
  
  if (clean.includes(',') && !clean.includes('.')) {
       clean = clean.replace(',', '.');
  } else if (clean.includes(',') && clean.includes('.')) {
      const commaIndex = clean.lastIndexOf(',');
      const dotIndex = clean.lastIndexOf('.');
      if (commaIndex > dotIndex) { // 1.000,00
          clean = clean.replace(/\./g, '').replace(',', '.');
      } else { // 1,000.00
          clean = clean.replace(/,/g, '');
      }
  }
  
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

export const transformCsvRowToProductInput = (row: CsvRow, rowNum: number): TransformResult => {
  try {
    const transformedData: any = {
      name: row.name,
      description: row.description || "",
      priceHt: parseLocaleNumber(row.priceHt),
      discountPrice: parseLocaleNumber(row.discountPrice) || null,
      taxRate: parseLocaleNumber(row.taxRate) || null,
      stock: parseLocaleNumber(row.stock),
      category: row.category, 
      subCategory: row.subCategory || null,
      leafCategory: row.leafCategory || null,
      sku: row.sku,
      
      weight: parseLocaleNumber(row.weight) || null,
      height: parseLocaleNumber(row.height) || null,
      width: parseLocaleNumber(row.width) || null,
      length: parseLocaleNumber(row.length) || null,
      
      material: row.material || null,
      origin: row.origin || null,
      tags: row.tags ? row.tags.split(",").map((t: string) => t.trim()) : [],
      
      images: row.images 
        ? row.images.split(",").map((url: string, index: number) => ({
            url: url.trim(),
            isMain: index === 0,
            order: index
          }))
        : [],
        
      status: row.status && Object.values(ProductStatus).includes(row.status as ProductStatus) 
        ? row.status 
        : ProductStatus.DRAFT,
    };

    // Validation
    const parsed = productSchema.safeParse(transformedData);
    
    if (!parsed.success) {
      const zodErrors = parsed.error.issues.map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return {
        success: false,
        error: `Validation: ${zodErrors}`,
        sku: row.sku
      };
    }

    // Return pure data ready for DB insertion (but without random logic ideally, tho SKU needs uniqueness)
    const sku = parsed.data.sku || `SKU-${randomUUID()}`;
    
    return {
      success: true,
      data: {
        ...parsed.data,
        sku
      }
    };

  } catch (e: any) {
    return {
      success: false,
      error: e.message || "Transformation error",
      sku: row.sku
    };
  }
};

