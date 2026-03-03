"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { shopifyService } from "@/features/vendor/integrations/shopify/shopify-service";
import { revalidatePath } from "next/cache";

export type ManualConnectState = {
  success?: boolean;
  error?: string;
};

export async function connectShopifyManually(prevState: ManualConnectState, formData: FormData): Promise<ManualConnectState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Non authentifié" };
  }

  const shopUrlRaw = formData.get("shopUrl") as string;
  const accessToken = formData.get("accessToken") as string;

  if (!shopUrlRaw || !accessToken) {
    return { error: "L'URL de la boutique et le jeton d'accès sont requis." };
  }

  // Normalize Shop URL
  let shopName = shopUrlRaw.trim();
  shopName = shopName.replace(/^https?:\/\//, ""); // Remove protocol
  shopName = shopName.replace(/\/$/, ""); // Remove trailing slash
  if (!shopName.includes(".myshopify.com")) {
      shopName = `${shopName}.myshopify.com`;
  }

  // Validate Token Format (Basic check)
  if (!accessToken.startsWith("shpat_")) {
    return { error: "Le jeton doit commencer par 'shpat_' (Admin API Access Token)." };
  }

  try {
    // 1. Verify the token works by fetching shop details
    const response = await fetch(`https://${shopName}/admin/api/2023-10/shop.json`, {
        method: "GET",
        headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            return { error: "Jeton invalide ou permissions insuffisantes." };
        }
        return { error: `Erreur de connexion à Shopify (${response.status}). Vérifiez l'URL de la boutique.` };
    }

    const data = await response.json();
    if (!data.shop) {
        return { error: "Impossible de récupérer les informations de la boutique." };
    }

    // 2. Find Vendor
    const vendor = await prisma.vendor.findUnique({
        where: { userId: session.user.id },
    });

    if (!vendor) {
        return { error: "Profil vendeur introuvable." };
    }

    // 3. Save Integration
    // We reuse the service method which handles encryption and DB update/create
    await shopifyService.handleOAuthCallback(shopName, accessToken, vendor.id);

    // 4. Trigger Initial Sync
    await shopifyService.syncInitialBatch(vendor.id);

    revalidatePath("/vendor/integrations");
    return { success: true };

  } catch (error) {
    console.error("Manual Shopify Connect Error:", error);
    return { error: "Une erreur inattendue est survenue lors de la connexion." };
  }
}
