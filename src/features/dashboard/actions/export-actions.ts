"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonToCsv } from "@/lib/csv-utils";

export async function exportOrdersToCsv() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const subOrders = await prisma.subOrder.findMany({
    where: { parentOrder: { buyerId: session.user.id } },
    include: {
        vendor: { select: { name: true } },
        parentOrder: { select: { createdAt: true } }
    },
    orderBy: { parentOrder: { createdAt: 'desc' } }
  });

  const formattedData = subOrders.map(o => ({
    "ID Commande": o.id,
    "Date": o.parentOrder.createdAt.toLocaleDateString('fr-FR'),
    "Marque": o.vendor.name,
    "Montant Total (€)": (o.totalAmount / 100).toFixed(2),
    "Statut": o.status,
  }));

  return { csvData: jsonToCsv(formattedData), filename: "export_commandes_cloza.csv" };
}

export async function exportPaymentsToCsv() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Non autorisé" };

    const subOrders = await prisma.subOrder.findMany({
        where: {
          parentOrder: { buyerId: session.user.id },
          status: { in: ["CONFIRMED", "SHIPPED", "DELIVERED"] }
        },
        include: {
          vendor: { select: { name: true } },
          parentOrder: { select: { createdAt: true } }
        }
    });

    const formattedData = subOrders.map(o => {
        const orderDate = new Date(o.parentOrder.createdAt);
        const dueDate = new Date(orderDate);
        dueDate.setDate(dueDate.getDate() + 60);

        return {
            "ID Commande": o.id,
            "Marque": o.vendor.name,
            "Date Commande": orderDate.toLocaleDateString('fr-FR'),
            "Echéance Paiement": dueDate.toLocaleDateString('fr-FR'),
            "Montant Dû (€)": (o.totalAmount / 100).toFixed(2),
            "Statut": o.payoutStatus,
        };
    });

    return { csvData: jsonToCsv(formattedData), filename: "export_paiements_cloza.csv" };
}
