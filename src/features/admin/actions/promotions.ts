"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deletePromotion(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.promotion.delete({
    where: { id },
  });

  revalidatePath("/admin/cms");
  revalidatePath("/");
  return { success: true };
}

export async function togglePromotionStatus(id: string, isActive: boolean) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.promotion.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/admin/cms");
  revalidatePath("/");
  return { success: true };
}
