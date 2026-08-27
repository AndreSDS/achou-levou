# Radar de Achados

App web para descobrir produtos do Mercado Livre, ranquear os melhores achados, gerar posts prontos (a partir dos 10 modelos do `pens.txt`) e disponibilizá-los para copiar/colar no Canal do WhatsApp.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Sem banco de dados (estado em `localStorage`)

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Configure as credenciais do Mercado Livre em `.env.local`:

- `ML_APP_ID`
- `ML_SECRET`
- `ML_ACCESS_TOKEN`
- `ML_AFFILIATE_ID`

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Estrutura

```
src/
├── app/
│   ├── layout.tsx, globals.css
│   ├── page.tsx              # Dashboard
│   ├── busca/page.tsx        # Busca de produtos
│   ├── post/page.tsx         # Gerador de posts
│   ├── historico/page.tsx    # Histórico
│   ├── config/page.tsx       # Configurações
│   └── api/ml/
│       ├── search/route.ts   # Proxy busca ML
│       └── link/route.ts     # Gera link de afiliado
├── components/
│   ├── ProductCard.tsx, Filters.tsx
│   ├── ScoreBadge.tsx, CategoryPicker.tsx, TemplatePicker.tsx
│   ├── PostPreview.tsx, RoutineTimeline.tsx
├── lib/
│   ├── mercadolivre.ts, scoring.ts
│   ├── templates.ts, categories.ts
│   ├── postBuilder.ts, storage.ts
└── types/index.ts
```

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run lint` — lint