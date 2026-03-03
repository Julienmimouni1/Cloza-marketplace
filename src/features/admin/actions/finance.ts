"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Category, PayoutStatus } from "@/generated/client";
import { exceptionSchema, payoutSettingsSchema, DEFAULT_COMMISSION_BPS } from "../schemas/finance";
import { z } from "zod";

export async function addCommissionException(vendorId: string, data: z.infer<typeof exceptionSchema>) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = exceptionSchema.parse(data);
  const rateBps = Math.round(validated.rate * 100);

  await prisma.commissionException.upsert({
    where: {
      vendorId_category: {
        vendorId,
        category: validated.category,
      }
    },
    update: { rate: rateBps },
    create: {
      vendorId,
      category: validated.category,
      rate: rateBps,
    },
  });

  revalidatePath(`/admin/users`);
}

export async function deleteCommissionException(exceptionId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.commissionException.delete({
    where: { id: exceptionId },
  });

  revalidatePath(`/admin/users`);
}

export async function updatePayoutSettings(vendorId: string, data: z.infer<typeof payoutSettingsSchema>) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = payoutSettingsSchema.parse(data);

  await prisma.payoutSettings.upsert({
    where: { vendorId },
    update: {
      schedule: validated.schedule,
      payoutsEnabled: validated.payoutsEnabled,
      suspensionReason: validated.payoutsEnabled ? null : validated.suspensionReason,
    },
    create: {
      vendorId,
      schedule: validated.schedule,
      payoutsEnabled: validated.payoutsEnabled,
      suspensionReason: validated.suspensionReason,
    },
  });

  revalidatePath(`/admin/users`);
}

export async function getFinanceData(vendorId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const [exceptions, payoutSettings, history] = await Promise.all([
    prisma.commissionException.findMany({ where: { vendorId } }),
    prisma.payoutSettings.findUnique({ where: { vendorId } }),
    prisma.commissionHistory.findMany({ 
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { vendor: { select: { name: true } } }
    })
  ]);

  return { exceptions, payoutSettings, history };
}

export async function getGlobalCommissionRate() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const setting = await prisma.systemSetting.findUnique({
    where: { key: "GLOBAL_COMMISSION_RATE" }
  });

  return setting ? parseInt(setting.value) : DEFAULT_COMMISSION_BPS;
}

export async function updateGlobalCommissionRate(rateBps: number) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.systemSetting.upsert({
    where: { key: "GLOBAL_COMMISSION_RATE" },
    update: { value: rateBps.toString() },
    create: {
      key: "GLOBAL_COMMISSION_RATE",
      value: rateBps.toString(),
      description: "Global platform commission rate in basis points"
    }
  });

  revalidatePath("/admin/finance");
}

export async function getFinancialSubOrders(payoutStatus: PayoutStatus | "ALL", subOrderStatus?: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const where: any = {};
  if (payoutStatus !== "ALL") {
    where.payoutStatus = payoutStatus;
  }
  if (subOrderStatus) {
    if (subOrderStatus === "NOT_DELIVERED") {
      where.status = { not: "DELIVERED" };
    } else {
      where.status = subOrderStatus;
    }
  }

  const subOrders = await prisma.subOrder.findMany({
    where,
    include: {
      vendor: {
        select: {
          id: true,
          name: true,
        },
      },
      parentOrder: {
        select: {
          id: true,
          currency: true,
          paymentMethod: true,
        },
      },
    },
    orderBy: {
      parentOrder: {
        createdAt: "desc",
      },
    },
    take: 50,
  });

  return subOrders;
}

export async function markSubOrderAsPaid(subOrderId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.subOrder.update({
    where: { id: subOrderId },
    data: {
      payoutStatus: PayoutStatus.PAID,
      payoutDate: new Date(),
    },
  });

  revalidatePath("/admin/finance");
}

export async function markSubOrderAsUnpaid(subOrderId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.subOrder.update({
    where: { id: subOrderId },
    data: {
      payoutStatus: PayoutStatus.PENDING,
      payoutDate: null,
    },
  });

  revalidatePath("/admin/finance");
}
