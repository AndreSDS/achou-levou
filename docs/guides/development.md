# Guia de Desenvolvimento

Convenções, estrutura e fluxo de trabalho para contribuir com o Radar de Achados.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Linguagem:** TypeScript
- **Estilo:** Tailwind CSS v4
- **Estado:** `localStorage` (sem banco de dados)
- **API externa:** Mercado Livre (public search + Affiliate API)

## Estrutura de diretórios

```
src/
├── app/
│   ├── layout.tsx           # Layout raiz + navegação
│   ├── page.tsx             # Dashboard
│   ├── busca/page.tsx       # Busca de produtos
│   ├── post/page.tsx        # Gerador de posts
│   ├── historico/page.tsx   # Histórico de posts
│   ├── config/page.tsx      # Configurações
│   └── api/ml/
│       ├── search/route.ts  # Proxy busca ML
│       └── link/route.ts    # Gera link de afiliado
├── components/
│   ├── ProductCard.tsx      # Card de produto
│   ├── Filters.tsx          # Filtros de busca
│   ├── ScoreBadge.tsx       # Badge de pontuação
│   ├── CategoryPicker.tsx   # Seletor de categoria
│   ├── TemplatePicker.tsx   # Seletor de template
│   ├── PostPreview.tsx      # Preview + botão copiar
│   └── RoutineTimeline.tsx  # Rotina diária
├── lib/
│   ├── mercadolivre.ts      # Client ML (search, affiliate link)
│   ├── scoring.ts           # Heurísticas de ranqueamento
│   ├── templates.ts         # 10 modelos de post
│   ├── categories.ts        # 8 categorias fixas
│   ├── postBuilder.ts       # Monta texto final do post
│   └── storage.ts           # localStorage (histórico, config)
└── types/index.ts           # Interfaces TypeScript
```

## Convenções

- **Client Components:** prefixo `"use client"` obrigatório quando usa `useState`, `useEffect`, `useRouter`, etc.
- **Nomes de arquivos:** `kebab-case` para componentes e páginas.
- **Estilo:** usar classes Tailwind; evitar estilos inline ou CSS modules.
- **Imagens:** usar `next/image` com `width`/`height` fixos ou `fill`.
- **Navegação:** usar `next/link` e `useRouter()`; evitar `<a>` para rotas internas.
- **API Routes:** tipar `NextRequest` e `NextResponse`; retornar erros com status HTTP apropriado.

## Como adicionar um novo template

1. Abra `src/lib/templates.ts`
2. Adicione um novo objeto ao array `templates` seguindo o formato existente
3. Use placeholders: `[NOME DO PRODUTO]`, `[PREÇO]`, `[LINK]`

## Como adicionar uma nova categoria

1. Abra `src/lib/categories.ts`
2. Adicione um novo objeto ao array `categories`
3. Defina `templateId` correspondente e `rules.keywords` para sugestão automática

## Como testar

```bash
# Lint
npm run lint

# Build
npm run build

# Dev
npm run dev
```

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Busca ML retorna erro 403 | Verifique se o IP não está bloqueado; ML bloqueia requests de alguns datacenters |
| Link de afiliado falha | Verifique `ML_ACCESS_TOKEN` e `ML_AFFILIATE_ID` no `.env.local` |
| Imagens não carregam | Adicione o hostname em `next.config.ts` em `images.remotePatterns` |
