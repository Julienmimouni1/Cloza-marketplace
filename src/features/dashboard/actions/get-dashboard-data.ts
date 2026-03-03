"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // 1. Fetch User Financials
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      creditLimit: true,
      outstandingBalance: true,
      role: true,
      companyName: true,
      kybStatus: true,
    }
  });

  if (!user) return null;

  // 2. Fetch Active Shipment (Most recent uncompleted SubOrder)
  const activeShipment = await prisma.subOrder.findFirst({
    where: {
      parentOrder: { buyerId: session.user.id },
      status: { in: ["SHIPPED", "CONFIRMED"] }
    },
    include: {
      vendor: { select: { name: true } },
      items: { include: { product: { select: { name: true } } } }
    },
    orderBy: { parentOrder: { createdAt: "desc" } }
  });

  // 3. Fetch Recent Orders (Limit 5)
  const recentOrders = await prisma.subOrder.findMany({
    where: {
      parentOrder: { buyerId: session.user.id }
    },
    take: 5,
    orderBy: { parentOrder: { createdAt: "desc" } },
    include: {
      vendor: { select: { name: true } },
      items: { include: { product: { select: { name: true, image: true } } } },
      parentOrder: { select: { createdAt: true } }
    }
  });

  // Calculate Available Credit
  const creditAvailable = user.creditLimit - user.outstandingBalance;

  // Format Active Shipment for UI
  let activeOrderData = null;
  if (activeShipment) {
    activeOrderData = {
        id: activeShipment.id,
        status: activeShipment.status,
        eta: activeShipment.estimatedDelivery?.toLocaleDateString() || "Pending",
        items: activeShipment.items.reduce((acc, item) => acc + item.quantity, 0),
        total: (activeShipment.totalAmount / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
        brand: activeShipment.vendor.name,
        progress: activeShipment.status === 'SHIPPED' ? 75 : 50,
        steps: [
            { label: "Ordered", date: "Oct 20", completed: true },
            { label: "Confirmed", date: "Oct 21", completed: true },
            { label: "Shipped", date: "Oct 22", completed: activeShipment.status === 'SHIPPED' },
            { label: "Delivered", date: activeShipment.estimatedDelivery?.toLocaleDateString(), completed: false },
        ]
    };
  }

  return {
    user: {
        name: session.user.name,
        isKybPending: user.role === "RETAILER" && (!user.companyName || user.kybStatus !== "APPROVED")
    },
    financials: {
        creditLimit: user.creditLimit / 100,
        creditUsed: user.outstandingBalance / 100,
        creditAvailable: creditAvailable / 100,
        nextPaymentDue: "Nov 20, 2026",
    },
    activeOrder: activeOrderData,
    recentOrders: recentOrders.map(o => ({
        id: o.id,
        brand: o.vendor.name,
        date: o.parentOrder.createdAt.toLocaleDateString(),
        items: o.items.reduce((acc, i) => acc + i.quantity, 0),
        total: (o.totalAmount / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
        status: o.status,
        img: o.items[0]?.product.image || "bg-zinc-200"
    }))
  };
}
