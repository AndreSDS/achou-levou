# Plano — Radar de Achados (app-publicaofertas)

App web para descobrir produtos do Mercado Livre, rankear os melhores achados,
gerar posts prontos (a partir dos 10 modelos do `pens.txt`) e disponibilizá-los
para copiar/colar no Canal do WhatsApp. MVP sem banco de dados: estado em
localStorage; segredos do ML em `.env.local`.

## Contexto (de `pens.txt`)
- Canal do WhatsApp já existe; modelo de posts definido.
- 8 categorias fixas: OFERTA RELÂMPAGO, ACHADO DO DIA, MENOR PREÇO, TECNOLOGIA,
  CASA & COZINHA, MODA & CALÇADOS, ACHADOS ATÉ R$50, MAIS VENDIDOS.
- 10 modelos de post (achado do dia, relâmpago, barato, tecnologia, casa,
  até R$50, mais vendido, urgência, comparação, combo).
- Rotina diária sugerida: 9h Achado do Dia, 12h Barato, 15h Tech/Casa,
  19h Oferta forte, 21h Top 3.
- Objetivo: "sistema de operação completo" (critérios de seleção + estrutura
  de postagem + processo diário).

## Decisões (confirmadas)
- **Postagem:** gerar post formatado + copiar/colar (não há API pública p/ Canais).
- **Dados:** API oficial de Afiliados do ML (precisa `ML_APP_ID`, `ML_SECRET`,
  `ML_ACCESS_TOKEN`/`ML_AFFILIATE_ID` fornecidos pelo usuário).
- **Stack:** Next.js (App Router) + React + Tailwind. Sem DB (localStorage).
- **Idioma UI:** Português (BR).

## Arquitetura
```
app-publicaofertas/
├── package.json, next.config.mjs, tailwind.config.ts, postcss.config.mjs
├── .env.local.example            # ML_APP_ID, ML_SECRET, ML_ACCESS_TOKEN, ML_AFFILIATE_ID
└── src/
    ├── app/
    │   ├── layout.tsx, globals.css
    │   ├── page.tsx              # Dashboard: rotina do dia + atalhos
    │   ├── busca/page.tsx        # Descoberta + filtros + ranking
    │   ├── post/page.tsx         # Gerador: produto + categoria/modelo -> preview + copiar
    │   ├── historico/page.tsx    # Posts gerados (localStorage)
    │   ├── config/page.tsx       # ID/credenciais do afiliado (salvo no navegador)
    │   └── api/ml/
    │       ├── search/route.ts   # proxy busca (protege tokens)
    │       └── link/route.ts     # gera link de afiliado via API ML
    ├── components/
    │   ├── ProductCard.tsx, Filters.tsx
    │   ├── ScoreBadge.tsx, CategoryPicker.tsx, TemplatePicker.tsx
    │   ├── PostPreview.tsx       # texto formatado + botão "Copiar"
    │   └── RoutineTimeline.tsx   # 5 slots da rotina diária
    ├── lib/
    │   ├── mercadolivre.ts       # client: search(), createAffiliateLink()
    │   ├── scoring.ts            # heurísticas de "potencial de clique"
    │   ├── templates.ts          # 10 modelos (placeholders)
    │   ├── categories.ts         # 8 categorias -> modelo + regras
    │   ├── postBuilder.ts        # aplica template + link -> texto final
    │   └── storage.ts            # localStorage (histórico, config)
    └── types/index.ts
```

### Fluxo de dados
1. `busca`: filtros (termo, categoria ML, faixa de preço, ordem) -> `GET /api/ml/search`
   (server proxy que chama `api.mercadolibre.com/sites/MLB/search`).
2. `scoring.ts` ranqueia resultados (desconto %, preço, vendas, frete grátis) e
   sugere a categoria de post de melhor encaixe.
3. `post`: escolhe produto + categoria/modelo -> `postBuilder` monta o texto e
   `GET /api/ml/link` gera o link de afiliado -> `PostPreview` com botão copiar.
4. `historico`: salva no localStorage para reuso/agendamento manual.
5. `config`: usuário informa `ML_AFFILIATE_ID` (e o app usa token de `.env.local`
   no servidor para gerar links).

### Critérios de scoring (heurísticas iniciais)
- Desconto: `(original_price - price) / original_price`.
- Preço baixo: `price <= 50` -> candidato "Achados até R$50"/"Menor Preço".
- Vendas (`sold_quantity`) alto -> "Mais Vendidos".
- Frete grátis + avaliação boa -> bônus.
- Categoria ML mapeada -> sugestão de categoria de post.

## Tarefas (atômicas, ordem de execução)
1. **Scaffold Next.js** — App Router + Tailwind + TS; `layout`, `globals.css`,
   `package.json`. Gate: `npm run build` passa.
2. **Tipos + `mercadolivre.ts`** — tipos de Produto; funções `search()` e
   `createAffiliateLink()` contra a API ML (token via env). Gate: busca real
   retorna itens em teste manual.
3. **`/api/ml/search` e `/api/ml/link`** — rotas proxy. Gate: `curl` local
   retorna JSON válido sem expor token no client.
4. **`categories.ts` + `templates.ts`** — 8 categorias e 10 modelos como dados
   (placeholders `[NOME]`, `[PREÇO]`, `[LINK]`). Gate: importa e renderiza.
5. **`scoring.ts`** — ranqueia e sugere categoria. Gate: dado um array de
   produtos, retorna ordem + categoria sugerida (teste unitário simples).
6. **`busca/page.tsx` + `Filters` + `ProductCard` + `ScoreBadge`** — UI de
   descoberta com filtros e ranking. Gate: busca exibe cards ranqueados.
7. **`postBuilder.ts` + `post/page.tsx` + `PostPreview` + `TemplatePicker` +
   `CategoryPicker`** — gera texto + link + copiar. Gate: post copiado bate o
   modelo e inclui link de afiliado.
8. **`storage.ts` + `historico/page.tsx` + `config/page.tsx`** — persistência
   localStorage de posts e ID do afiliado. Gate: recarregar mantém histórico.
9. **`page.tsx` (Dashboard) + `RoutineTimeline`** — rotina diária de 5 slots
   com atalhos para busca/post. Gate: navegação completa funciona.
10. **Polish + README** — instruções de `.env.local`, como obter credenciais ML
    e rodar `npm run dev`. Gate: README reproduz setup.

## Riscos / pendências
- **Credenciais ML:** usuário deve fornecer `ML_APP_ID`/`ML_SECRET`/`ML_ACCESS_TOKEN`
  e `ML_AFFILIATE_ID`. Sem isso, só a busca pública (sem link de afiliado) funciona.
- **Link de afiliado oficial:** endpoint exato depende do nível do programa de
  afiliados; pode exigir OAuth em vez de token estático (prever rota de refresh).
- **Limites de taxa da API ML:** adicionar cache simples (TTL em memória) nas rotas.
- **ToS do WhatsApp:** confirmação de que copiar/colar manual está dentro das regras.

## Validação
- `npm run build` e `npm run lint` sem erros.
- Busca real retorna produtos; link de afiliado gerado é clicável e rastreável.
- Post gerado reproduz fielmente um dos 10 modelos com dados reais.
- Copiar/colar produz texto idêntico ao preview.
- Histórico persiste após reload.
