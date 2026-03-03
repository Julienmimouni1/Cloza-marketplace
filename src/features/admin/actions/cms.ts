"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { PromotionSchema } from "../schemas";
import { z } from "zod";

type ActionResponse<T = any> = 
  | { success: true; data: T } 
  | { success: false; error: { code: string; message: string } };

export async function getCmsData() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const [vendors, promotions, vendorsWithProducts] = await Promise.all([
    prisma.vendor.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.promotion.findMany({
      orderBy: { isActive: "desc" },
    }),
    prisma.vendor.findMany({
      include: {
        products: {
          orderBy: { name: "asc" },
        }
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return { vendors, promotions, vendorsWithProducts };
}

export async function toggleProductTrending(productId: string, isTrending: boolean): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    const value = !!isTrending;
    
    // We use a separate data object to be very explicit
    const updateData = { isTrending: value };

    await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    revalidatePath("/admin/cms");
    revalidatePath("/");
    return { success: true, data: null };
  } catch (error: any) {
    console.error("[CMS ACTION] Failed to update product trending status:", error);
    return { success: false, error: { code: "UPDATE_FAILED", message: error.message || "Failed to update product status" } };
  }
}

export async function toggleVendorFeatured(vendorId: string, isFeatured: boolean): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    await prisma.vendor.update({
      where: { id: vendorId },
      data: { isFeatured },
    });

    revalidatePath("/admin/cms");
    revalidatePath("/"); // Homepage
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: { code: "UPDATE_FAILED", message: "Failed to update vendor status" } };
  }
}

export async function updatePromotion(id: string, rawData: unknown): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    const validatedData = PromotionSchema.parse(rawData);

    const promotion = await prisma.promotion.update({
      where: { id },
      data: validatedData,
    });

    revalidatePath("/admin/cms");
    revalidatePath("/");
    return { success: true, data: promotion };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: { code: "VALIDATION_ERROR", message: error.issues[0].message } };
    }
    return { success: false, error: { code: "UPDATE_FAILED", message: "Failed to update promotion" } };
  }
}

export async function createPromotion(rawData: unknown): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    const validatedData = PromotionSchema.parse(rawData);

    const promotion = await prisma.promotion.create({
      data: validatedData,
    });

    revalidatePath("/admin/cms");
    revalidatePath("/");
    return { success: true, data: promotion };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: { code: "VALIDATION_ERROR", message: error.issues[0].message } };
    }
    return { success: false, error: { code: "CREATE_FAILED", message: "Failed to create promotion" } };
  }
}

export async function deletePromotion(id: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
    }

    await prisma.promotion.delete({
      where: { id },
    });

    revalidatePath("/admin/cms");
    revalidatePath("/");
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: { code: "DELETE_FAILED", message: "Failed to delete promotion" } };
  }
}