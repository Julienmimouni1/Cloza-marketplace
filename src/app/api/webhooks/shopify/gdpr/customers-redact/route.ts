import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const hmac = req.headers.get("x-shopify-hmac-sha256");
  const topic = req.headers.get("x-shopify-topic");
  const shop = req.headers.get("x-shopify-shop-domain");

  console.log(`[Shopify GDPR] Topic: ${topic} for ${shop}`);

  // In a real app, you would verify HMAC here and then delete customer data.
  // For now, we return 200 OK as required by Shopify.
  return NextResponse.json({ message: "Received" }, { status: 200 });
}
