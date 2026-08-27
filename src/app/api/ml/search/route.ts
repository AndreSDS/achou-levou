import { NextRequest, NextResponse } from "next/server";
import { searchML } from "@/lib/mercadolivre";
import { scoreItems } from "@/lib/scoring";

const cache = new Map<string, { data: unknown; expires: number }>();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || undefined;
  const minPrice = searchParams.get("price_min") ? Number(searchParams.get("price_min")) : undefined;
  const maxPrice = searchParams.get("price_max") ? Number(searchParams.get("price_max")) : undefined;
  const order = (searchParams.get("order") || "relevance") as "price_asc" | "price_desc" | "relevance" | "sold_quantity";

  const cacheKey = `${query}|${category}|${minPrice}|${maxPrice}|${order}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.data);
  }

  try {
    const data = await searchML({ query, category, minPrice, maxPrice, order });
    const scored = scoreItems(data.results);

    const response = {
      ...data,
      results: scored,
    };

    cache.set(cacheKey, { data: response, expires: Date.now() + 60000 });
    return NextResponse.json(response);
  } catch (error) {
    console.error("ML search error:", error);
    return NextResponse.json({ error: "Failed to search ML" }, { status: 500 });
  }
}