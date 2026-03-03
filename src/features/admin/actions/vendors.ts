"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { billingSchema, shippingSchema, identitySchema } from "@/features/admin/schemas/vendor-schemas";

export async function updateVendorCommissionRate(vendorId: string, newRateBps: number | null) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    select: { commissionRate: true }
  });

  if (!vendor) throw new Error("Vendor not found");

  const currentRate = vendor.commissionRate;

  if (currentRate === newRateBps) return;

  await prisma.$transaction(async (tx) => {
    // Update Vendor
    await tx.vendor.update({
      where: { id: vendorId },
      data: { commissionRate: newRateBps },
    });

    // Log History
    await tx.commissionHistory.create({
      data: {
        vendorId,
        oldRate: currentRate,
        newRate: newRateBps,
        changedBy: session.user.id,
        reason: "Vendor rate update",
      },
    });
  });

  revalidatePath(`/admin/vendors/${vendorId}`);
  revalidatePath("/admin/finance");
}

export async function updateVendorBilling(vendorId: string, data: z.infer<typeof billingSchema>) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  
  const validated = billingSchema.parse(data);

  await prisma.vendor.update({
    where: { id: vendorId },
    data: { billingInfo: validated as any },
  });

  revalidatePath(`/admin/users`); 
}

export async function updateVendorShipping(vendorId: string, data: z.infer<typeof shippingSchema>) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = shippingSchema.parse(data);

  await prisma.vendor.update({
    where: { id: vendorId },
    data: { shippingInfo: validated as any },
  });
  
  revalidatePath(`/admin/users`);
}

export async function createVendorProfile(userId: string, data: { name: string; slug: string }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Check if user already has a vendor profile
  const existing = await prisma.vendor.findUnique({
    where: { userId },
  });

  if (existing) throw new Error("User is already a vendor");

  // Create vendor profile
  await prisma.vendor.create({
    data: {
      userId,
      name: data.name,
      slug: data.slug,
      commissionRate: null, // Use global default
    },
  });

  // Ensure user role is updated to VENDOR
  await prisma.user.update({
    where: { id: userId },
    data: { role: "VENDOR" },
  });

  revalidatePath(`/admin/users/${userId}`);
}

export async function updateVendorIdentity(vendorId: string, data: z.infer<typeof identitySchema>) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = identitySchema.parse(data);

  const vendor = await prisma.vendor.update({
    where: { id: vendorId },
    data: {
      name: validated.name,
      user: {
        update: {
          companyName: validated.companyName,
          siret: validated.siret,
          vatNumber: validated.vatNumber,
        }
      }
    }
  });

  if (vendor.userId) {
     revalidatePath(`/admin/users/${vendor.userId}`);
  }
}

export async function toggleVendorStatus(vendorId: string, isFeatured: boolean) {
  // Using isFeatured as a proxy for "Active/Featured" status for now as there is no isActive field
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.vendor.update({
    where: { id: vendorId },
    data: { isFeatured },
  });

  revalidatePath(`/admin/users`);
}

export async function getVendorProducts(vendorId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return await prisma.product.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      priceHt: true,
      stock: true,
      status: true,
      image: true,
      sku: true,
      isTrending: true,
    }
  });
}

export async function getVendorStats(vendorId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const subOrders = await prisma.subOrder.findMany({
    where: { vendorId },
    select: { 
      totalAmount: true,
      commissionAmount: true
    }
  });

  const gmv = subOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalCommission = subOrders.reduce((acc, curr) => acc + curr.commissionAmount, 0);

  return {
    gmv,
    totalCommission,
    orderCount: subOrders.length,
  };
}

export async function getVendorCommissionHistory(vendorId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return await prisma.commissionHistory.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
    include: {
      // If we want the name of who changed it, we might need to fetch the user
      // But prisma schema says 'changedBy' is a String (ID). 
      // Ideally we should have a relation, but the schema defined it as String.
      // We'll return it as is.
    }
  });
}
