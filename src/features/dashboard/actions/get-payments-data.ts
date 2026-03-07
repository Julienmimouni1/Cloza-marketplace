"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getPaymentsData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // 1. Get user credit info
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      creditLimit: true,
      outstandingBalance: true,
    }
  });

  if (!user) return null;

  // 2. Get all suborders that involve payment (we use PENDING payoutStatus to mean buyer hasn't paid yet in this context, or we track it via parentOrder. We need to define "due date").
  // Assuming a Net 60 terms based on order creation date for this context.
  const subOrders = await prisma.subOrder.findMany({
    where: {
      parentOrder: {
        buyerId: session.user.id,
      },
      // Exclude cancelled or very early stages if needed, but for BNPL, once confirmed, it's a debt.
      status: {
        in: ["CONFIRMED", "SHIPPED", "DELIVERED"]
      }
    },
    include: {
      vendor: {
        select: { name: true }
      },
      parentOrder: {
        select: { createdAt: true }
      }
    },
    orderBy: {
      parentOrder: { createdAt: 'asc' } // Oldest first to find next due date easily
    }
  });

  // Calculate 60 days terms
  const now = new Date();
  
  const paymentSchedule = subOrders.map(order => {
    const orderDate = new Date(order.parentOrder.createdAt);
    const dueDate = new Date(orderDate);
    dueDate.setDate(dueDate.getDate() + 60);
    
    // Status logic
    const isOverdue = dueDate < now && order.payoutStatus === "PENDING";
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    let paymentStatus = "DUE_LATER";
    if (order.payoutStatus === "PAID") paymentStatus = "PAID";
    else if (isOverdue) paymentStatus = "OVERDUE";
    else if (daysUntilDue <= 7) paymentStatus = "DUE_SOON";

    return {
      id: order.id,
      parentOrderId: order.parentOrderId,
      vendorName: order.vendor.name,
      amount: order.totalAmount, // in cents
      orderDate: orderDate,
      dueDate: dueDate,
      status: paymentStatus,
      daysUntilDue,
      isPaid: order.payoutStatus === "PAID"
    };
  });

  // Calculate Aggregates
  const pendingPayments = paymentSchedule.filter(p => !p.isPaid);
  const totalDue = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  
  // Find next due date (closest future date, or an overdue one)
  const sortedPending = pendingPayments.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  const nextPayment = sortedPending.length > 0 ? sortedPending[0] : null;

  return {
    creditLimit: user.creditLimit,
    outstandingBalance: totalDue, // Overriding user.outstandingBalance with real calculation for accuracy
    nextPaymentDueAmount: nextPayment?.amount || 0,
    nextPaymentDueDate: nextPayment?.dueDate || null,
    schedule: paymentSchedule.sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime()), // Newest due date first for list
  };
}
