import { MLItem, ScoredItem } from "@/types";
import { categories } from "./categories";

const DISCOUNT_WEIGHT = 40;
const PRICE_BONUS = 20;
const SALES_WEIGHT = 20;
const SHIPPING_WEIGHT = 10;

export function scoreItems(items: MLItem[]): ScoredItem[] {
  const maxSold = Math.max(...items.map((i) => i.sold_quantity ?? 0), 1);

  return items
    .map((item) => {
      const discount = item.original_price && item.original_price > item.price
        ? (item.original_price - item.price) / item.original_price
        : 0;

      const priceScore = item.price <= 50 ? PRICE_BONUS : 0;
      const salesScore = item.sold_quantity ? (item.sold_quantity / maxSold) * SALES_WEIGHT : 0;
      const shippingScore = item.shipping.free_shipping ? SHIPPING_WEIGHT : 0;

      const reasons: string[] = [];
      const score = discount * DISCOUNT_WEIGHT + priceScore + salesScore + shippingScore;

      if (discount > 0.3) {
        reasons.push(`Desconto de ${Math.round(discount * 100)}%`);
      }
      if (item.price <= 50) {
        reasons.push("Preço baixo");
      }
      if (item.shipping.free_shipping) {
        reasons.push("Frete grátis");
      }
      if (item.sold_quantity && item.sold_quantity > 100) {
        reasons.push("Alta demanda");
      }

      const suggestedCategory = categories.find((c) => {
        if (c.id === "achados-ate-50" && item.price <= 50) return true;
        if (c.id === "mais-vendidos" && item.sold_quantity && item.sold_quantity >= 50) return true;
        const titleLower = item.title.toLowerCase();
        return c.rules.keywords.some((kw) => titleLower.includes(kw));
      }) || categories[0];

      return {
        ...item,
        score,
        suggestedCategory,
        discount,
        reasons,
      };
    })
    .sort((a, b) => b.score - a.score);
}