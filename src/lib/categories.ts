import { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "oferta-relampago",
    name: "OFERTA RELÂMPAGO",
    icon: "⚡",
    templateId: 2,
    rules: {
      keywords: ["promocao", "relampago", "limitada", "desconto", "oferta"],
    },
  },
  {
    id: "achado-do-dia",
    name: "ACHADO DO DIA",
    icon: "🔥",
    templateId: 1,
    rules: {
      keywords: ["destaque", "top", "melhor", "principal"],
    },
  },
  {
    id: "menor-preco",
    name: "MENOR PREÇO",
    icon: "💰",
    templateId: 3,
    rules: {
      keywords: ["barato", "preco baixo", "economia"],
    },
  },
  {
    id: "tecnologia",
    name: "TECNOLOGIA",
    icon: "📱",
    templateId: 4,
    rules: {
      keywords: ["celular", "smartphone", "fone", "tablet", "notebook", "eletronico", "gadget", "tech", "camera", "video game", "console", "acessorio"],
    },
  },
  {
    id: "casa-cozinha",
    name: "CASA & COZINHA",
    icon: "🏠",
    templateId: 5,
    rules: {
      keywords: ["casa", "cozinha", "utilidade", "domestico", "moveis", "decoracao", "organizador"],
    },
  },
  {
    id: "achados-ate-50",
    name: "ACHADOS ATÉ R$50",
    icon: "🎁",
    templateId: 6,
    rules: {
      keywords: ["baratinho", "ate 50", "achado", "promocao"],
      maxPrice: 50,
    },
  },
  {
    id: "mais-vendidos",
    name: "MAIS VENDIDOS",
    icon: "⭐",
    templateId: 7,
    rules: {
      keywords: ["vendido", "popular", "top", "mais vendido"],
      minSoldQuantity: 50,
    },
  },
  {
    id: "moda-calcados",
    name: "MODA & CALÇADOS",
    icon: "👟",
    templateId: 3,
    rules: {
      keywords: ["tenis", "calcado", "roupa", "bolsa", "mochila", "acessorio", "moda", "jaqueta", "camiseta"],
    },
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryByName(name: string): Category | undefined {
  return categories.find((c) => c.name === name);
}

export function suggestCategory(title: string, price: number, soldQuantity: number | undefined): Category {
  const lower = title.toLowerCase();

  for (const cat of categories) {
    if (cat.id === "achados-ate-50" && price <= 50) {
      return cat;
    }
    if (cat.id === "mais-vendidos" && soldQuantity && soldQuantity >= 50) {
      return cat;
    }
    if (cat.rules.keywords.some((kw) => lower.includes(kw))) {
      return cat;
    }
  }

  if (price <= 50) return categories.find((c) => c.id === "achados-ate-50")!;
  if (soldQuantity && soldQuantity >= 50) return categories.find((c) => c.id === "mais-vendidos")!;

  return categories[0];
}