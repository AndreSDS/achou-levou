export interface MLItem {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  thumbnail: string;
  permalink: string;
  shipping: {
    free_shipping: boolean;
  };
  address?: {
    city_name?: string;
  };
  sold_quantity?: number;
  category_id?: string;
  condition?: string;
  available_quantity?: number;
}

export interface MLSearchResponse {
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
  results: MLItem[];
}

export interface MLAffiliateLinkResponse {
  affiliate_link: {
    url: string;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  templateId: number;
  rules: {
    keywords: string[];
    maxPrice?: number;
    minSoldQuantity?: number;
  };
}

export interface PostTemplate {
  id: number;
  name: string;
  category: string;
  body: string;
}

export interface PostData {
  id: string;
  title: string;
  body: string;
  product: MLItem;
  category: Category;
  template: PostTemplate;
  affiliateUrl: string;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  order?: "price_asc" | "price_desc" | "relevance" | "sold_quantity";
}

export interface ScoredItem extends MLItem {
  score: number;
  suggestedCategory: Category;
  discount: number;
  reasons: string[];
}

export interface AppConfig {
  mlAffiliateId: string;
}

export interface MLTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  obtained_at: number;
  scope?: string;
  user_id?: string;
}

export interface MLAuthState {
  state: string;
  code_verifier: string;
  expires_at: number;
}