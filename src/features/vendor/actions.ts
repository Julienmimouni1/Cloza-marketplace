"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema, ProductInput } from "./schemas";
import { ActionResponse } from "@/types/action-response";
import { revalidatePath } from "next/cache";
import { ProductStatus, ProductSource, IntegrationType } from "@/generated/client";
import { z } from "zod";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function createProduct(data: ProductInput): Promise<ActionResponse<string>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } };
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return { success: false, error: { code: "FORBIDDEN", message: "Profil vendeur non trouvé" } };
  }

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Données invalides" } };
  }

  try {
    const slug = `${parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    const sku = parsed.data.sku || `SKU-${randomUUID()}`;

    const { images, ...productData } = parsed.data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        description: productData.description || "",
        priceHt: Math.round(productData.priceHt * 100),
        discountPrice: productData.discountPrice ? Math.round(productData.discountPrice * 100) : null,
        slug,
        sku,
        vendorId: vendor.id,
        source: ProductSource.MANUAL,
        image: images.find(img => img.isMain)?.url || images[0]?.url,
        images: {
          create: images.map((img) => ({
            url: img.url,
            isMain: img.isMain,
            order: img.order,
          })),
        },
      },
    });

    revalidatePath("/vendor/products");
    return { success: true, data: product.id };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: { code: "INTERNAL_ERROR", message: "Erreur lors de la création du produit" } };
  }
}

export async function updateProduct(id: string, data: ProductInput): Promise<ActionResponse<void>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } };
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return { success: false, error: { code: "FORBIDDEN", message: "Profil vendeur non trouvé" } };
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct || existingProduct.vendorId !== vendor.id) {
    return { success: false, error: { code: "FORBIDDEN", message: "Produit non trouvé ou accès refusé" } };
  }

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Données invalides" } };
  }

  try {
    const { images, ...productData } = parsed.data;

    await prisma.$transaction([
      // Delete old images
      prisma.productImage.deleteMany({
        where: { productId: id },
      }),
      // Update product and create new images
      prisma.product.update({
        where: { id },
        data: {
          ...productData,
          description: productData.description || "",
          priceHt: Math.round(productData.priceHt * 100),
          discountPrice: productData.discountPrice ? Math.round(productData.discountPrice * 100) : null,
          image: images.find(img => img.isMain)?.url || images[0]?.url,
          images: {
            create: images.map((img) => ({
              url: img.url,
              isMain: img.isMain,
              order: img.order,
            })),
          },
        },
      }),
    ]);

    revalidatePath("/vendor/products");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: { code: "INTERNAL_ERROR", message: "Erreur lors de la mise à jour du produit" } };
  }
}

/**
 * Uploads an image to the local public/uploads directory.
 */
export async function uploadProductImage(formData: FormData): Promise<ActionResponse<string>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, error: { code: "VALIDATION_ERROR", message: "Aucun fichier fourni" } };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_"); // Sanitize
    const filename = `${uniqueSuffix}-${originalName}`;
    
    // Ensure upload dir exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return relative path
    const fileUrl = `/uploads/${filename}`;
    return { success: true, data: fileUrl };

  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: { code: "INTERNAL_ERROR", message: "Erreur lors de l'upload du fichier" } };
  }
}

export async function deleteProduct(id: string): Promise<ActionResponse<void>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } };
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return { success: false, error: { code: "FORBIDDEN", message: "Profil vendeur non trouvé" } };
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct || existingProduct.vendorId !== vendor.id) {
    return { success: false, error: { code: "FORBIDDEN", message: "Produit non trouvé ou accès refusé" } };
  }

  try {
    // Soft delete (Archive)
    await prisma.product.update({
      where: { id },
      data: { status: ProductStatus.ARCHIVED },
    });

    revalidatePath("/vendor/products");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error archiving product:", error);
    return { success: false, error: { code: "INTERNAL_ERROR", message: "Erreur lors de l'archivage du produit" } };
  }
}

export type BulkImportResult = {
  successCount: number;
  errorCount: number;
  errors: Array<{ row: number; error: string; sku?: string }>;
};

import { CsvRow, transformCsvRowToProductInput } from "./logic/csv-transformer";

// ... (existing imports)

export async function bulkCreateProducts(
  rawProducts: CsvRow[]
): Promise<ActionResponse<BulkImportResult>> {
  let session;
  try {
    session = await auth();
  } catch (e) {
    console.error("Auth check failed in bulkCreateProducts:", e);
    return { success: false, error: { code: "INTERNAL_ERROR", message: "Erreur d'authentification" } };
  }

  if (!session?.user?.id) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } };
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return { success: false, error: { code: "FORBIDDEN", message: "Profil vendeur non trouvé" } };
  }

  const results: BulkImportResult = {
    successCount: 0,
    errorCount: 0,
    errors: [],
  };

  // Process sequentially
  for (let i = 0; i < rawProducts.length; i++) {
    const row = rawProducts[i];
    const rowNum = i + 1;

    try {
      // 1. Transform & Validate via Shared Logic
      const transformResult = transformCsvRowToProductInput(row, rowNum);

      if (!transformResult.success || !transformResult.data) {
        results.errorCount++;
        results.errors.push({
          row: rowNum,
          error: transformResult.error || "Validation failed",
          sku: transformResult.sku
        });
        continue;
      }

      const { images, ...productData } = transformResult.data;
      const slug = `${productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}-${i}`;
      const sku = productData.sku;

      // 3. Database Operation (Upsert)
      const existingProduct = await prisma.product.findFirst({
        where: {
          vendorId: vendor.id,
          sku: sku
        }
      });

      if (existingProduct) {
        // Update
        await prisma.$transaction([
          prisma.productImage.deleteMany({ where: { productId: existingProduct.id } }),
          prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              ...productData,
              description: productData.description || "",
              priceHt: Math.round(productData.priceHt * 100),
              discountPrice: productData.discountPrice ? Math.round(productData.discountPrice * 100) : null,
              status: ProductStatus.ACTIVE,
              source: ProductSource.CSV,
              image: images.find((img: any) => img.isMain)?.url || images[0]?.url || "https://placehold.co/600x400",
              images: {
                create: images.map((img: any) => ({
                  url: img.url,
                  isMain: img.isMain,
                  order: img.order,
                })),
              },
            },
          })
        ]);
      } else {
        // Create
        await prisma.product.create({
          data: {
            ...productData,
            description: productData.description || "",
            priceHt: Math.round(productData.priceHt * 100),
            discountPrice: productData.discountPrice ? Math.round(productData.discountPrice * 100) : null,
            slug,
            sku,
            vendorId: vendor.id,
            status: ProductStatus.ACTIVE,
            source: ProductSource.CSV,
            image: images.find((img: any) => img.isMain)?.url || images[0]?.url || "https://placehold.co/600x400",
            images: {
              create: images.map((img: any) => ({
                url: img.url,
                isMain: img.isMain,
                order: img.order,
              })),
            },
          },
        });
      }

      results.successCount++;

    } catch (err: any) {
      console.error(`Error processing row ${rowNum}:`, err);
      results.errorCount++;
      results.errors.push({
        row: rowNum,
        error: "Erreur interne lors du traitement",
        sku: row.sku
      });
    }
  }

  revalidatePath("/vendor/products");
  return { success: true, data: results };
}

export async function bulkUpdateProductStatus(
  ids: string[],
  status: ProductStatus
): Promise<ActionResponse<void>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } };
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return { success: false, error: { code: "FORBIDDEN", message: "Profil vendeur non trouvé" } };
  }

  try {
    await prisma.product.updateMany({
      where: {
        id: { in: ids },
        vendorId: vendor.id, // Security: Ensure vendor owns these products
      },
      data: { status },
    });

    revalidatePath("/vendor/products");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error bulk updating products:", error);
    return { success: false, error: { code: "INTERNAL_ERROR", message: "Erreur lors de la mise à jour en masse" } };
  }
}

export async function bulkUpdateAllProductStatus(
  filters: { q?: string; status?: ProductStatus },
  status: ProductStatus
): Promise<ActionResponse<void>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } };
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return { success: false, error: { code: "FORBIDDEN", message: "Profil vendeur non trouvé" } };
  }

  try {
    await prisma.product.updateMany({
      where: {
        vendorId: vendor.id,
        name: filters.q ? { contains: filters.q, mode: "insensitive" } : undefined,
        status: filters.status || undefined,
      },
      data: { status },
    });

    revalidatePath("/vendor/products");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error bulk updating all products:", error);
    return { success: false, error: { code: "INTERNAL_ERROR", message: "Erreur lors de la mise à jour globale" } };
  }
}

export async function bulkDeleteProducts(ids: string[]): Promise<ActionResponse<void>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } };
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return { success: false, error: { code: "FORBIDDEN", message: "Profil vendeur non trouvé" } };
  }

  try {
    // Delete images first to avoid orphans (if cascade isn't set perfectly, but Prisma handles cascade delete usually)
    // Actually, Prisma schema has onDelete: Cascade for images, so deleting product is enough.
    
    await prisma.product.deleteMany({
      where: {
        id: { in: ids },
        vendorId: vendor.id, // Security check
      },
    });

    revalidatePath("/vendor/products");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error bulk deleting products:", error);
    return { success: false, error: { code: "INTERNAL_ERROR", message: "Erreur lors de la suppression" } };
  }
}

export async function bulkDeleteAllProducts(
  filters: { q?: string; status?: ProductStatus }
): Promise<ActionResponse<void>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } };
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return { success: false, error: { code: "FORBIDDEN", message: "Profil vendeur non trouvé" } };
  }

  try {
    await prisma.product.deleteMany({
      where: {
        vendorId: vendor.id,
        name: filters.q ? { contains: filters.q, mode: "insensitive" } : undefined,
        status: filters.status || undefined,
      },
    });

    revalidatePath("/vendor/products");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error bulk deleting all products:", error);
    return { success: false, error: { code: "INTERNAL_ERROR", message: "Erreur lors de la suppression globale" } };
  }
}

// --- Integrations ---

export async function createIntegration(data: {
  type: "SHOPIFY" | "WOOCOMMERCE";
  config: any;
}): Promise<ActionResponse<void>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } };
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return { success: false, error: { code: "FORBIDDEN", message: "Profil vendeur non trouvé" } };
  }

  try {
    await prisma.externalIntegration.create({
      data: {
        vendorId: vendor.id,
        type: data.type as IntegrationType, 
        config: data.config,
        status: "ACTIVE",
      },
    });

    revalidatePath("/vendor/integrations");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error creating integration:", error);
    return { success: false, error: { code: "INTERNAL_ERROR", message: "Erreur lors de la création de l'intégration" } };
  }
}

export async function deleteIntegration(id: string): Promise<ActionResponse<void>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } };

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id } });
  if (!vendor) return { success: false, error: { code: "FORBIDDEN", message: "Profil vendeur non trouvé" } };

  try {
    const integration = await prisma.externalIntegration.findUnique({ where: { id } });
    if (!integration || integration.vendorId !== vendor.id) {
       return { success: false, error: { code: "FORBIDDEN", message: "Intégration non trouvée" } };
    }

    await prisma.externalIntegration.delete({ where: { id } });
    revalidatePath("/vendor/integrations");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: "Erreur suppression" } };
  }
}

import { shopifyService } from "./integrations/shopify/shopify-service";

// Placeholder for actual sync logic
export async function syncIntegration(id: string): Promise<ActionResponse<void>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } };

  try {
    const integration = await prisma.externalIntegration.findUnique({
      where: { id },
    });

    if (!integration) {
      return { success: false, error: { code: "NOT_FOUND", message: "Intégration non trouvée" } };
    }

    if (integration.type === "SHOPIFY") {
      await shopifyService.syncProducts(id);
    } 
    // Add other providers here (WooCommerce, etc.)

    revalidatePath("/vendor/integrations");
    revalidatePath("/vendor/products");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Sync error:", error);
    return { success: false, error: { code: "INTERNAL_ERROR", message: "Erreur de synchronisation" } };
  }
}

export type OrderReportItem = {
  date: Date;
  orderId: string;
  customer: string;
  productName: string;
  sku: string;
  quantity: number;
  priceAtPurchase: number;
  totalHt: number;
  commissionAmount: number;
  netAmount: number;
  status: string;
};

export async function getVendorOrdersReport(): Promise<ActionResponse<OrderReportItem[]>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } };
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return { success: false, error: { code: "FORBIDDEN", message: "Profil vendeur non trouvé" } };
  }

  try {
    const subOrders = await prisma.subOrder.findMany({
      where: { vendorId: vendor.id },
      include: {
        parentOrder: {
          select: { createdAt: true, buyer: { select: { companyName: true } } }
        },
        items: {
          include: { product: { select: { name: true, sku: true } } }
        }
      },
      orderBy: { parentOrder: { createdAt: 'desc' } }
    });

    const reportData: OrderReportItem[] = subOrders.flatMap(so => 
      so.items.map(item => ({
        date: so.parentOrder.createdAt,
        orderId: so.id,
        customer: so.parentOrder.buyer.companyName || "N/A",
        productName: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        totalHt: item.quantity * item.priceAtPurchase,
        commissionAmount: Math.round((item.quantity * item.priceAtPurchase * so.commissionRateApplied) / 10000),
        netAmount: (item.quantity * item.priceAtPurchase) - Math.round((item.quantity * item.priceAtPurchase * so.commissionRateApplied) / 10000),
        status: so.status
      }))
    );

    return { success: true, data: reportData };
  } catch (error) {
    console.error("Error fetching report data:", error);
    return { success: false, error: { code: "INTERNAL_ERROR", message: "Erreur lors de la génération du rapport" } };
  }
}

