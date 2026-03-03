"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getAdminStats() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Fetch stats in parallel
  const [
    totalGmvResult,
    pendingKybCount,
    openDisputesCount,
    activeUsersCount,
    recentOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { status: "PAID" }, // Only count paid orders for GMV
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.user.count({
      where: { kybStatus: "IN_REVIEW" },
    }),
    prisma.dispute.count({
      where: { status: "OPEN" },
    }),
    prisma.user.count({
      where: {
        role: { in: ["RETAILER", "VENDOR"] },
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        buyer: {
          select: {
            name: true,
            companyName: true,
          }
        }
      }
    }),
  ]);

  return {
    gmv: totalGmvResult._sum.totalAmount || 0,
    pendingKyb: pendingKybCount,
    openDisputes: openDisputesCount,
    activeUsers: activeUsersCount,
    recentOrders,
  };
}
