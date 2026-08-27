import { ScoredItem, PostTemplate, PostData } from "@/types";

export function buildPost(
  product: ScoredItem,
  template: PostTemplate,
  affiliateUrl: string
): PostData {
  const price = formatCurrency(product.price);
  const originalPrice = product.original_price && product.original_price > product.price
    ? formatCurrency(product.original_price)
    : "R$ XXX";

  let body = template.body;

  body = body.replace(/\[NOME DO PRODUTO\]/g, product.title);
  body = body.replace(/\[NOME\]/g, product.title);
  body = body.replace(/\[Produto\]/g, product.title);

  body = body.replace(/\[PREÇO\]/g, price);
  body = body.replace(/\[LINK\]/g, affiliateUrl);
  body = body.replace(/\[SEU LINK DE AFILIADO\]/g, affiliateUrl);

  if (product.original_price && product.original_price > product.price) {
    body = body.replace(/R\$ XXX/g, originalPrice);
  }

  return {
    id: crypto.randomUUID(),
    title: template.name,
    body,
    product,
    category: product.suggestedCategory,
    template,
    affiliateUrl,
    createdAt: new Date().toISOString(),
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}