"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { decryptFile } from "@/features/identity/utils/encryption";
import fs from "fs/promises";
import path from "path";

export async function getPendingKybRequests() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return await prisma.user.findMany({
    where: {
      kybStatus: "IN_REVIEW",
    },
    select: {
      id: true,
      name: true,
      email: true,
      companyName: true,
      siret: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "asc",
    },
  });
}

export async function getKybRequestDetails(userId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      documents: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function reviewKybRequest(userId: string, status: "APPROVED" | "REJECTED", reason?: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      kybStatus: status,
      // In a real app, we might want to store the rejection reason in a separate field or log
    },
  });

  revalidatePath("/admin/kyb");
  revalidatePath(`/admin/kyb/${userId}`);
  
  // Mock Email Notification
  console.log(`[EMAIL MOCK] To: ${userId}, Status: ${status}, Reason: ${reason || "N/A"}`);

  return { success: true };
}

export async function getDecryptedDocument(documentId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const document = await prisma.kybDocument.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  const absolutePath = path.join(process.cwd(), document.filePath);
  const encryptedBuffer = await fs.readFile(absolutePath);
  const decryptedBuffer = decryptFile(encryptedBuffer, document.encryptionIv);

  return {
    content: decryptedBuffer.toString("base64"),
    mimeType: document.mimeType,
    fileName: document.originalName,
  };
}
