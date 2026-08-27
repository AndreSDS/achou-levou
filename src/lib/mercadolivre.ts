import { MLSearchResponse, MLAffiliateLinkResponse, SearchFilters } from "@/types";

const MLB_BASE = "https://api.mercadolibre.com";

export async function searchML(filters: SearchFilters): Promise<MLSearchResponse> {
  const params = new URLSearchParams();
  params.set("site", "MLB");
  params.set("limit", "20");
  if (filters.query) params.set("q", filters.query);
  if (filters.category) params.set("category", filters.category);
  if (filters.minPrice) params.set("price_min", String(filters.minPrice));
  if (filters.maxPrice) params.set("price_max", String(filters.maxPrice));
  if (filters.order) params.set("sort", filters.order);

  const res = await fetch(`${MLB_BASE}/sites/MLB/search?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`ML search failed: ${res.status}`);
  }

  return res.json();
}

export async function createAffiliateLink(itemId: string, affiliateId: string): Promise<string> {
  const appId = process.env.ML_APP_ID;
  const secret = process.env.ML_SECRET;
  const accessToken = process.env.ML_ACCESS_TOKEN;

  if (!appId || !secret || !accessToken) {
    throw new Error("ML credentials missing. Configure .env.local.");
  }

  const res = await fetch(`${MLB_BASE}/affiliate/create_link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      application_id: appId,
      platform_id: affiliateId,
      product: {
        id: itemId,
      },
    }),
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ML affiliate link failed: ${res.status} ${text}`);
  }

  const data: MLAffiliateLinkResponse = await res.json();
  return data.affiliate_link.url;
}