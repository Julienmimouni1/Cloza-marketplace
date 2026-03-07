"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Non autorisé" };
  }

  const name = formData.get("name") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const zipCode = formData.get("zipCode") as string;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phoneNumber,
        address,
        city,
        zipCode,
      },
    });

    revalidatePath("/[locale]/dashboard/settings", "page");
    return { success: "Profil mis à jour" };
  } catch (error) {
    console.error("Update Profile Error:", error);
    return { error: "Erreur lors de la mise à jour" };
  }
}

export async function requestEmailChange(email: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Non autorisé" };
  }

  // Placeholder for Magic Link logic
  // 1. Generate Token
  // 2. Send Email
  // 3. Return Pending Status
  
  console.log(`Email change requested for ${session.user.id} to ${email}`);
  return { success: "Lien de confirmation envoyé à votre nouvelle adresse" };
}
