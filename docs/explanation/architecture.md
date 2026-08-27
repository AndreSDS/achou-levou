# Arquitetura

Decisões técnicas, fluxo de dados e trade-offs do Radar de Achados.

## Visão geral

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Browser   │────▶│  Next.js App │────▶│  ML Public API  │
│  (Cliente)  │◀────│  (App Router)│◀────│  (busca pública) │
└─────────────┘     └──────┬───────┘     └─────────────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │  API Route Proxy │────▶ ML Affiliate API
                   │  /api/ml/*       │     (gera link)
                   └──────────────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │  localStorage    │
                   │  (histórico, cfg)│
                   └──────────────────┘
```

## Decisões técnicas

### Next.js App Router

- **Por que:** rotas dinâmicas (`/api/ml/*`) e estáticas (`/busca`, `/post`) coexistem naturalmente.
- **Trade-off:** App Router ainda está em evolução; algumas APIs (como `searchParams` como Promise) mudaram no Next.js 16.

### Sem banco de dados

- **Por que:** MVP rápido, sem custos de infraestrutura, sem migrações.
- **Trade-off:** histórico não sincroniza entre dispositivos; limite de ~5MB no `localStorage`.

### Proxy serverless para ML

- **Por que:** protege tokens (`ML_APP_ID`, `ML_SECRET`, `ML_ACCESS_TOKEN`) de exposição no cliente.
- **Trade-off:** adiciona latência (~50-200ms) por request; resolvido com cache TTL de 60s.

### Cache em memória

- **Por que:** respeita rate limits do ML sem adicionar dependências externas (Redis, etc.).
- **Trade-off:** cache por instância; em deploy serverless com múltiplas instâncias, cada uma tem seu próprio cache.

### Scoring heurístico

- **Por que:** ranqueamento simples e determinístico sem ML/AI; fácil de ajustar pesos.
- **Trade-off:** não aprende com comportamento do usuário; regras fixas podem não capturar nuance de todos os nichos.

### Geração de posts via templates

- **Por que:** controle total sobre o texto; não depende de LLM (que pode alucinar).
- **Trade-off:** flexibilidade limitada ao que os templates cobrem; adicionar novo modelo exige edição de código.

## Fluxo de dados

1. **Busca:** filtros → `GET /api/ml/search` → ML Public API → `scoreItems()` → UI
2. **Geração de post:** produto selecionado + template → `buildPost()` → `POST /api/ml/link` → link de afiliado → preview + copy
3. **Persistência:** post salvo em `localStorage`; config (affiliate ID) também

## Segurança

- Tokens do ML vivem apenas em `.env.local` (server-side).
- `ML_AFFILIATE_ID` não é segredo; pode ser salvo em `localStorage`.
- API Routes validam entrada e retornam erros genéricos (sem stack trace em produção).

## Limitações conhecidas

- WhatsApp Channels não tem API de postagem → fluxo copy/paste manual.
- `ML_ACCESS_TOKEN` expira → usuário precisa renovar e atualizar `.env.local`.
- `localStorage` não persiste em modo anônimo/privado do navegador.
