import { PostTemplate } from "@/types";

export const templates: PostTemplate[] = [
  {
    id: 1,
    name: "Achado do dia",
    category: "ACHADO DO DIA",
    body: `🔥 ACHADO DO DIA

🛒 [NOME DO PRODUTO]

💰 De ~~R$ XXX~~ por apenas:

🔥 [PREÇO]

✅ [Benefício 1]
✅ [Benefício 2]
✅ [Benefício 3]

⚠️ O preço pode mudar a qualquer momento!

👇 CONFIRA A OFERTA
[LINK]`,
  },
  {
    id: 2,
    name: "Oferta relâmpago",
    category: "OFERTA RELÂMPAGO",
    body: `⚡ OFERTA RELÂMPAGO!

🚨 [NOME DO PRODUTO]

De ~~R$ XXX~~ por:

🔥 [PREÇO]

⏳ Oferta por tempo limitado ou enquanto durar o estoque.

👇 APROVEITAR AGORA
[LINK]`,
  },
  {
    id: 3,
    name: "Produto barato",
    category: "MENOR PREÇO",
    body: `💰 ACHADO BARATINHO!

Você não precisa gastar muito para encontrar algo útil. 👀

🛒 [NOME DO PRODUTO]

🔥 Apenas [PREÇO]

⭐ [Principal vantagem]

👇 VER OFERTA
[LINK]`,
  },
  {
    id: 4,
    name: "Tecnologia",
    category: "TECNOLOGIA",
    body: `📱 ACHADO DE TECNOLOGIA

🔥 [NOME DO PRODUTO]

💰 De ~~R$ XXX~~ por [PREÇO]

Ideal para quem procura:

✅ [Benefício]
✅ [Benefício]
✅ [Benefício]

👇 CONFIRA O PREÇO ATUAL
[LINK]`,
  },
  {
    id: 5,
    name: "Casa e cozinha",
    category: "CASA & COZINHA",
    body: `🏠 ACHADO PARA CASA

Olha esse produto! 😍

🛒 [NOME DO PRODUTO]

💰 Apenas [PREÇO]

Perfeito para facilitar o dia a dia.

👇 VER OFERTA
[LINK]`,
  },
  {
    id: 6,
    name: "Achados até R$50",
    category: "ACHADOS ATÉ R$50",
    body: `🎁 ACHADO ATÉ R$50

🔥 Produto: [NOME]

💰 Preço: [PREÇO]

Um daqueles achados que surpreendem pelo preço. 👀

👇 CONFIRA AQUI
[LINK]`,
  },
  {
    id: 7,
    name: "Mais vendido",
    category: "MAIS VENDIDOS",
    body: `⭐ ENTRE OS MAIS PROCURADOS

🛒 [NOME DO PRODUTO]

🔥 Preço atual: [PREÇO]

Por que esse produto chama atenção?

✅ [Benefício]
✅ [Benefício]
✅ [Benefício]

👇 VER PRODUTO
[LINK]`,
  },
  {
    id: 8,
    name: "Urgência",
    category: "OFERTA RELÂMPAGO",
    body: `🚨 CORRE QUE PODE ACABAR!

🔥 [NOME DO PRODUTO]

De ~~R$ XXX~~ por:

💥 [PREÇO]

⚠️ Estoque e preço podem mudar rapidamente.

👇 GARANTA O SEU
[LINK]`,
  },
  {
    id: 9,
    name: "Comparação de preço",
    category: "MENOR PREÇO",
    body: `💸 OLHA A DIFERENÇA DE PREÇO!

🛒 [NOME DO PRODUTO]

❌ Preço anterior: R$ XXX

🔥 Preço atual: [PREÇO]

Economia de aproximadamente R$ XX.

👇 CONFERIR OFERTA
[LINK]`,
  },
  {
    id: 10,
    name: "Combo",
    category: "MAIS VENDIDOS",
    body: `🔥 COMBO DE ACHADOS

Separei 3 produtos que estão valendo a pena hoje:

1️⃣ [Produto] — [PREÇO]
🔗 [LINK]

2️⃣ [Produto] — [PREÇO]
🔗 [LINK]

3️⃣ [Produto] — [PREÇO]
🔗 [LINK]

⚡ Qual deles você compraria?`,
  },
];

export function getTemplateById(id: number): PostTemplate | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplatesByCategory(categoryName: string): PostTemplate[] {
  return templates.filter((t) => t.category === categoryName);
}