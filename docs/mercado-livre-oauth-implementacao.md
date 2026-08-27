# Implementação: Autenticação OAuth 2.0 — Mercado Livre

## Resumo

Integração de fluxo OAuth 2.0 Authorization Code + PKCE (`S256`) para autenticação com o Mercado Livre, substituindo o token estático anterior. A implementação mantém fallback para o token `.env` durante a transição.

## Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/ml-auth.ts` | Utilitários server-side: geração PKCE, armazenamento de tokens/estado em `.data/`, refresh automático, validação de TTL. |
| `src/app/api/ml/auth/login/route.ts` | Inicia fluxo OAuth: gera `code_verifier`, `code_challenge` (SHA-256) e `state`; redireciona para ML. |
| `src/app/api/ml/auth/callback/route.ts` | Callback do ML: valida `state`, troca `code` por tokens, persiste em `.data/ml-tokens.json`, redireciona para `/config`. |
| `src/app/api/ml/auth/refresh/route.ts` | Retorna `access_token` válido, renovando via `refresh_token` quando próximo da expiração (buffer 5 min). |
| `src/app/api/ml/auth/revoke/route.ts` | Remove tokens armazenados (logout). Retorna `200`. |
| `src/app/api/ml/auth/status/route.ts` | Retorna status da conexão (`connected`, `user_id`, `scope`, `expires_in`). |

## Arquivos modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/lib/mercadolivre.ts` | `createAffiliateLink` agora usa `getValidAccessToken()` (OAuth) com fallback para `process.env.ML_ACCESS_TOKEN`. |
| `src/app/config/page.tsx` | Removida seção de autenticação ML; adicionado botão que redireciona para `/auth`. |
| `src/app/auth/page.tsx` | Nova página dedicada de autenticação OAuth (conectar/desconectar, status, loading, mensagens). |
| `src/types/index.ts` | Novas interfaces: `MLTokens`, `MLAuthState`. |
| `.env.local.example` | Adicionada variável `ML_REDIRECT_URI`. |
| `.gitignore` | Adicionado `.data/`. |

## Decisões técnicas

- **Armazenamento**: arquivo JSON local (`.data/ml-tokens.json`). Funciona em dev e self-hosted. Para serverless (ex: Vercel), migrar para KV store.
- **PKCE**: `code_challenge_method=S256` usando `crypto` nativo do Node (sem dependências externas).
- **State/CSRF**: armazenado em arquivo com TTL de 5 minutos.
- **Refresh**: access token renovado automaticamente 5 minutos antes da expiração (6h). Refresh token expira em 6 meses.
- **Erros**: `invalid_grant` limpa tokens e força re-autenticação.
- **Fallback**: se OAuth não configurado/inválido, usa token estático do `.env`.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `ML_APP_ID` | Sim | ID da aplicação ML. |
| `ML_SECRET` | Sim | Segredo da aplicação ML (server-side only). |
| `ML_ACCESS_TOKEN` | Não | Token estático legado (fallback). |
| `ML_REDIRECT_URI` | Sim | URL de callback exatamente igual à registrada no app ML. Ex: `http://localhost:3000/api/ml/auth/callback`. |

## Como usar

1. Configure `.env.local` com `ML_APP_ID`, `ML_SECRET` e `ML_REDIRECT_URI`.
2. Acesse `/auth` para gerenciar a autenticação Mercado Livre.
3. Clique em **Conectar conta Mercado Livre**.
4. Autorize no Mercado Livre.
5. O app redireciona para `/auth` e exibe status conectado.
6. `createAffiliateLink` passará a usar o token OAuth automaticamente.
7. Para desconectar, clique em **Desconectar conta** (remove tokens armazenados).

## Validação

- `npm run lint` — sem erros.
- `npx tsc --noEmit` — sem erros de tipo.
- Teste manual:
  1. Acesse `/auth` e verifique o status inicial.
  2. Clique em **Conectar conta Mercado Livre**.
  3. Autorize no ML.
  4. Verifique redirecionamento para `/auth?status=success`.
  5. Verifique status "Conectado", `user_id` e tempo de expiração.
  6. Clique em **Desconectar conta** e confirme limpeza de tokens.
  7. Acesse `/config` e verifique botão **Abrir autenticação** que leva para `/auth`.
  8. Verifique fallback para token estático se OAuth estiver desconectado.
  9. Simular expiração de access_token (6h) e verificar refresh automático.
  10. Testar error states (revogar permissão no painel ML e verificar comportamento).

## Telas

| Rota | Descrição |
|------|-----------|
| `/auth` | Tela dedicada de autenticação ML (status, conectar, desconectar). |
| `/config` | Configurações gerais + botão de acesso à autenticação ML. |

## Próximos passos (não implementado)

- Migrar armazenamento de tokens para KV store (ex: Vercel KV) para ambientes serverless.
- Adicionar testes automatizados para fluxo OAuth (mock de `fetch` e filesystem).
- Adicionar indicador visual de tempo restante do token na UI.
