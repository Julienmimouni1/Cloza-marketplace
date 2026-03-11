import { NextRequest, NextResponse } from "next/server";
import { shopifyService } from "@/features/vendor/integrations/shopify/shopify-service";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || "mock_key";
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || "mock_secret";
const HOST = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // Use the configured public URL as priority to avoid tunnel/proxy host mismatches
  const redirectUri = `${HOST}/api/integrations/shopify/auth`;

  const cookieStore = await cookies();

  // Phase 2: Handle Callback (Code is present)
  if (code) {
      const shopDomain = searchParams.get("shop");
      
      // F2 Fix: Verify Nonce (State)
      const storedNonce = cookieStore.get("shopify_nonce")?.value;
      if (!state || state !== storedNonce) {
          return NextResponse.json({ error: "Invalid state parameter (CSRF protection)" }, { status: 403 });
      }
      
      // Clear nonce after verification
      cookieStore.delete("shopify_nonce");

      if (!shopDomain) {
          return NextResponse.json({ error: "Missing shop parameter" }, { status: 400 });
      }

      // Exchange code for access token
      try {
          const tokenResponse = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  client_id: SHOPIFY_API_KEY,
                  client_secret: SHOPIFY_API_SECRET,
                  code,
                  redirect_uri: redirectUri, // Mandatory if provided in phase 1
              }),
          });
          
          const tokenData = await tokenResponse.json();
          
          if (!tokenData.access_token) {
              console.error("Shopify Token Error", tokenData);
              return NextResponse.json({ error: "Failed to get access token" }, { status: 500 });
          }

          const session = await auth();
          if (!session?.user?.id) {
              return NextResponse.json({ error: "Authentication required" }, { status: 401 });
          }

          const vendor = await prisma.vendor.findUnique({
              where: { userId: session.user.id },
          });

          if (!vendor) {
              return NextResponse.json({ error: "No vendor profile found for this user" }, { status: 404 });
          }

          await shopifyService.handleOAuthCallback(shopDomain, tokenData.access_token, vendor.id);
          await shopifyService.syncInitialBatch(vendor.id);

          return NextResponse.redirect(`${HOST}/vendor/integrations?integration=success`);
          
      } catch (error) {
          console.error("OAuth Exception", error);
          return NextResponse.json({ error: "OAuth failed" }, { status: 500 });
      }
  }

  // Phase 1: Redirect to Shopify Login
  if (shop) {
      if (SHOPIFY_API_KEY === "mock_key" || SHOPIFY_API_SECRET === "mock_secret") {
          return NextResponse.json({ 
              error: "Shopify API Keys are missing. Please configure SHOPIFY_API_KEY and SHOPIFY_API_SECRET in your .env file." 
          }, { status: 500 });
      }

      const scope = "read_products,read_inventory,write_inventory";
      
      // F2 Fix: Generate and store secure nonce
      const nonce = Math.random().toString(36).substring(2, 15);
      cookieStore.set("shopify_nonce", nonce, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600 // 1 hour
      });
      
      console.log("[Shopify Auth] Redirect URI:", redirectUri);
      
      const encodedRedirectUri = encodeURIComponent(redirectUri);
      const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${scope}&redirect_uri=${encodedRedirectUri}&state=${nonce}`;
      
      return NextResponse.redirect(installUrl);
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
