"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAllUsers(search?: string, role?: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const where: any = {};
  
  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { companyName: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role && role !== "ALL") {
    where.role = role;
  }

  const [users, counts] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyName: true,
        kybStatus: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.groupBy({
      by: ['role'],
      _count: true,
    })
  ]);

  const stats = {
    ALL: counts.reduce((acc, curr) => acc + curr._count, 0),
    RETAILER: counts.find(c => c.role === "RETAILER")?._count || 0,
    VENDOR: counts.find(c => c.role === "VENDOR")?._count || 0,
    ADMIN: counts.find(c => c.role === "ADMIN")?._count || 0,
  };

  return { users, stats };
}

export async function updateUserRole(userId: string, role: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function getUserDetails(userId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      vendor: true,
      _count: {
        select: {
          orders: true,
        }
      }
    }
  });

  if (!user) return null;

  // Get global commission rate
  const globalRateSetting = await prisma.systemSetting.findUnique({
    where: { key: "GLOBAL_COMMISSION_RATE" }
  });
  const globalRate = globalRateSetting ? parseInt(globalRateSetting.value) : 1500;

  return { user, globalRate };
}
