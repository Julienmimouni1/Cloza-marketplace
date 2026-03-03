"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProductStatus(productId: string, status: any) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.product.update({
    where: { id: productId },
    data: { status },
  });

  revalidatePath("/admin/users/[id]", "page");
  return { success: true };
}

export async function toggleProductTrending(productId: string, isTrending: boolean) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.product.update({
    where: { id: productId },
    data: { isTrending },
  });

  revalidatePath("/admin/users/[id]", "page");
  return { success: true };
}

export async function deleteProductAdmin(productId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // We should ideally soft-delete, but for now we follow the schema
  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/admin/users/[id]", "page");
  return { success: true };
}
