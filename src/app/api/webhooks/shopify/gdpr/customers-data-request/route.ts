import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const topic = req.headers.get("x-shopify-topic");
  const shop = req.headers.get("x-shopify-shop-domain");

  console.log(`[Shopify GDPR] Topic: ${topic} for ${shop}`);

  // Mandatory endpoint: respond 200 to acknowledge data request.
  return NextResponse.json({ message: "Received" }, { status: 200 });
}
