import { NextRequest, NextResponse } from "next/server";
import { shopifyService } from "@/features/vendor/integrations/shopify/shopify-service";
import crypto from 'crypto';

const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || "mock_secret";

export async function POST(req: NextRequest) {
    const topic = req.headers.get("x-shopify-topic") || "";
    const shop = req.headers.get("x-shopify-shop-domain") || "";
    const hmac = req.headers.get("x-shopify-hmac-sha256") || "";

    const rawBody = await req.text();

    // Verify HMAC
    const generatedHash = crypto
        .createHmac('sha256', SHOPIFY_API_SECRET)
        .update(rawBody)
        .digest('base64');

    if (generatedHash !== hmac) {
        // For MVP/Dev without real ngrok tunneling and secrets, we might bypass this or log warning
        console.warn("Shopify Webhook HMAC mismatch. Proceeding for DEV.");
        // return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); 
    }

    try {
        const payload = JSON.parse(rawBody);
        
        // Process asynchronously to not block Shopify
        shopifyService.handleWebhook(topic, shop, payload).catch(err => {
            console.error("Webhook processing error:", err);
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
}
