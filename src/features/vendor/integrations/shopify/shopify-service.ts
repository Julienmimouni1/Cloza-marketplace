import { prisma } from "@/lib/prisma";
import { IntegrationType, ProductSource, Category, ProductStatus } from "@/generated/client";
import crypto from "crypto";

// Encryption setup for sensitive tokens
const ENCRYPTION_KEY = process.env.SHOPIFY_ENCRYPTION_KEY || "temporary_key_32_chars_long_12345"; // Should be 32 bytes
const IV_LENGTH = 16;

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text: string) {
  const parts = text.split(":");
  if (parts.length !== 2) return null; // Invalid format
  
  try {
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = Buffer.from(parts[1], "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (e) {
    console.error("Decryption failed", e);
    return null;
  }
}

export const shopifyService = {
  syncProducts: async (id: string) => {
    console.log(`Syncing Shopify integration ${id}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return Promise.resolve();
  },

  handleOAuthCallback: async (shop: string, accessToken: string, vendorId: string) => {
    console.log(`Storing credentials for ${shop} linked to vendor ${vendorId}`);

    const encryptedToken = encrypt(accessToken);

    // F4 Fix: Match on shop domain to avoid overwriting different stores
    const integrations = await prisma.externalIntegration.findMany({
      where: { vendorId, type: IntegrationType.SHOPIFY }
    });

    const matchingStore = integrations.find(i => (i.config as any)?.shop === shop);

    if (matchingStore) {
      await prisma.externalIntegration.update({
        where: { id: matchingStore.id },
        data: {
          config: { shop, accessToken: encryptedToken },
          status: "ACTIVE",
          updatedAt: new Date()
        }
      });
    } else {
      await prisma.externalIntegration.create({
        data: {
          vendorId,
          type: IntegrationType.SHOPIFY,
          config: { shop, accessToken: encryptedToken },
          status: "ACTIVE"
        }
      });
    }

    return true;
  },

  syncInitialBatch: async (vendorId: string) => {
    console.log(`Triggering immediate initial sync for vendor ${vendorId}`);
    
    // 1. Get Integration
    const integration = await prisma.externalIntegration.findFirst({
      where: { 
        vendorId, 
        type: IntegrationType.SHOPIFY,
        status: "ACTIVE"
      },
      orderBy: { updatedAt: 'desc' } // Get most recently updated
    });

    if (!integration || !integration.config) {
        console.error("No active Shopify integration found for vendor", vendorId);
        return;
    }

    const config = integration.config as { shop: string, accessToken: string };
    const shop = config.shop;
    const token = decrypt(config.accessToken);

    if (!token) {
        console.error("Failed to decrypt Shopify access token");
        return;
    }

    try {
      // 2. Fetch Products from Shopify
      console.log(`Fetching products from ${shop}...`);
      const response = await fetch(`https://${shop}/admin/api/2024-01/products.json?limit=50&status=active`, {
          headers: {
              "X-Shopify-Access-Token": token,
              "Content-Type": "application/json"
          }
      });

      if (!response.ok) {
          const errorText = await response.text();
          console.error(`Shopify API Error (${response.status}):`, errorText);
          return;
      }

      const data = await response.json();
      const shopifyProducts = data.products || [];
      console.log(`Found ${shopifyProducts.length} products to import.`);

      // 3. Map & Insert
      let importedCount = 0;
      for (const sp of shopifyProducts) {
          // Skip if no variants
          if (!sp.variants || sp.variants.length === 0) continue;

          // Simple mapping strategy: Take first variant as main product
          // In a real app, we might create multiple products or handle variants properly
          const mainVariant = sp.variants[0];
          
          // Generate unique slug
          const slug = `${sp.handle}-${vendorId.slice(-4)}-${Date.now()}`; // Ensure uniqueness

          // Basic Duplicate Check (by externalId or SKU)
          const existing = await prisma.product.findFirst({
              where: { 
                  vendorId,
                  OR: [
                      { externalId: sp.id.toString() },
                      { sku: mainVariant.sku || `SHP-${sp.id}` }
                  ]
              }
          });

          if (existing) {
              console.log(`Skipping duplicate product ${sp.title} (ID: ${sp.id})`);
              continue;
          }

          // Create Product
          await prisma.product.create({
              data: {
                  name: sp.title,
                  slug: slug,
                  description: sp.body_html || sp.title, // Shopify description is HTML
                  priceHt: Math.round(parseFloat(mainVariant.price) * 100), // Cents
                  stock: mainVariant.inventory_quantity || 0,
                  sku: mainVariant.sku || `SHP-${sp.id}`,
                  category: Category.Textile, // Default fallback
                  status: ProductStatus.ACTIVE,
                  vendorId: vendorId,
                  source: ProductSource.SHOPIFY,
                  externalId: sp.id.toString(),
                  // Images
                  images: sp.images && sp.images.length > 0 ? {
                      create: sp.images.map((img: any, idx: number) => ({
                          url: img.src,
                          isMain: idx === 0,
                          order: idx
                      }))
                  } : undefined,
                  // Main image fallback (legacy field)
                  image: sp.images && sp.images.length > 0 ? sp.images[0].src : "https://placehold.co/600x400?text=No+Image",
                  
                  // Meta fields
                  tags: sp.tags ? sp.tags.split(',').map((t: string) => t.trim()) : [],
                  weight: mainVariant.grams || 0
              }
          });
          importedCount++;
      }
      
      console.log(`Successfully imported ${importedCount} products from Shopify.`);

      // Update sync time
      await prisma.externalIntegration.update({
        where: { id: integration.id },
        data: { lastSync: new Date() }
      });

    } catch (e) {
      console.error("Critical error during Shopify sync", e);
    }
    
    return Promise.resolve();
  },

  handleWebhook: async (topic: string, shop: string, payload: any) => {
    console.log(`Received Webhook: ${topic} for ${shop}`);
    return Promise.resolve();
  }
};

