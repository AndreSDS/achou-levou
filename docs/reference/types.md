# Referência de Tipos

Interfaces e tipos TypeScript centrais do projeto.

## `src/types/index.ts`

### `MLItem`

Representa um produto retornado pela API de busca do Mercado Livre.

```ts
interface MLItem {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  thumbnail: string;
  permalink: string;
  shipping: { free_shipping: boolean };
  address?: { city_name?: string };
  sold_quantity?: number;
  category_id?: string;
  condition?: string;
  available_quantity?: number;
}
```

### `ScoredItem`

Estende `MLItem` com o resultado do ranqueamento (`scoring.ts`).

```ts
interface ScoredItem extends MLItem {
  score: number;
  suggestedCategory: Category;
  discount: number;
  reasons: string[];
}
```

### `Category`

Categoria fixa de post.

```ts
interface Category {
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
```

### `PostTemplate`

Modelo de post.

```ts
interface PostTemplate {
  id: number;
  name: string;
  category: string;
  body: string;
}
```

### `PostData`

Post final gerado, pronto para copiar.

```ts
interface PostData {
  id: string;
  title: string;
  body: string;
  product: MLItem;
  category: Category;
  template: PostTemplate;
  affiliateUrl: string;
  createdAt: string;
}
```

### `SearchFilters`

Parâmetros de busca.

```ts
interface SearchFilters {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  order?: "price_asc" | "price_desc" | "relevance" | "sold_quantity";
}
```

### `AppConfig`

Configurações salvas em `localStorage`.

```ts
interface AppConfig {
  mlAffiliateId: string;
}
```
