import { NextRequest, NextResponse } from "next/server";
import { createAffiliateLink } from "@/lib/mercadolivre";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, affiliateId } = body as { itemId: string; affiliateId: string };

    if (!itemId || !affiliateId) {
      return NextResponse.json({ error: "itemId and affiliateId are required" }, { status: 400 });
    }

    const url = await createAffiliateLink(itemId, affiliateId);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("ML affiliate link error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create affiliate link" },
      { status: 500 }
    );
  }
}