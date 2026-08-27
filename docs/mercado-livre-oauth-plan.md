# Plano: Autenticação e Autorização OAuth 2.0 — Mercado Livre

## 1. Referência da documentação
Fluxo recomendado: **Authorization Code Grant Type (Server Side) com PKCE** (Proof Key for Code Exchange, método `S256`).
Fonte: https://developers.mercadolivre.com.br/pt_br/autenticacao-e-autorizacao

## 2. Estado atual do código
- App Next.js 16 (App Router), React 19, TypeScript, Tailwind v4.
- Single-user ("Radar de Achados"), sem sistema de login próprio.
- Token ML atual é **estático via `.env`** (`ML_ACCESS_TOKEN`).
- `createAffiliateLink` em `src/lib/mercadolivre.ts` usa esse token estático.
- Não há armazenamento server-side de credenciais OAuth.

## 3. Decisões arquiteturais
- **Modelo**: single-user. O afiliado autoriza o app uma vez; tokens são persistidos localmente no servidor.
- **Armazenamento**: arquivo JSON local (`.data/ml-tokens.json`) no servidor. Funciona para desenvolvimento e self-hosted. Para Vercel/serverless, migrar depois para KV store.
- **Fluxo**: OAuth 2.0 Authorization Code + PKCE (`S256`), conforme recomendado pela doc.
- **Scope**: `offline_access read write`.
- **Fallback**: `createAffiliateLink` continua aceitando `ML_ACCESS_TOKEN` estático se OAuth não estiver configurado.

## 4. Tarefas de implementação

### 4.1 Criar módulo auxiliar server-side
**Arquivo**: `src/lib/ml-auth.ts`
- `generatePKCE()` → `{ codeVerifier, codeChallenge }`
- `hashSHA256(plain)`
- `randomState()`
- `getMLTokens()` / `saveMLTokens(tokens)` — lê/grava `.data/ml-tokens.json`
- `refreshAccessToken(refreshToken)` — POST `/oauth/token` com `grant_type=refresh_token`
- `getValidAccessToken()` — retorna access_token válido ou renova automaticamente

### 4.2 Criar API route: login
**Arquivo**: `src/app/api/ml/auth/login/route.ts`
- Gera `code_verifier` + `code_challenge` (`S256`) + `state`
- Armazena estado temporário (TTL curto, ex: 5 min)
- Redireciona para:
  ```
  https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=$APP_ID&redirect_uri=$REDIRECT_URI&state=$STATE&code_challenge=$CHALLENGE&code_challenge_method=S256
  ```

### 4.3 Criar API route: callback
**Arquivo**: `src/app/api/ml/auth/callback/route.ts`
- Valida `state` contra o armazenado
- POST para `https://api.mercadolibre.com/oauth/token` com:
  - `grant_type=authorization_code`
  - `client_id`
  - `client_secret`
  - `code`
  - `redirect_uri`
  - `code_verifier`
- Armazena `access_token`, `refresh_token`, `expires_in`, `user_id`, `scope`, `obtained_at`
- Redireciona para `/config?auth=success`

### 4.4 Criar API route: refresh
**Arquivo**: `src/app/api/ml/auth/refresh/route.ts`
- Lê `refresh_token` armazenado
- Faz POST `/oauth/token` com `grant_type=refresh_token`
- Atualiza tokens e retorna novo `access_token`

### 4.5 Criar API route: revoke
**Arquivo**: `src/app/api/ml/auth/revoke/route.ts`
- Remove tokens armazenados (logout)
- Retorna `204`

### 4.6 Criar API route: status
**Arquivo**: `src/app/api/ml/auth/status/route.ts`
- Retorna status da conexão (`connected`, `user_id`, `expires_in`, `scope`) ou `null`
- Usado pelo frontend para exibir estado da autenticação

### 4.7 Atualizar `src/lib/mercadolivre.ts`
- `createAffiliateLink` deve usar token OAuth dinâmico ao invés de `process.env.ML_ACCESS_TOKEN`
- Implementar: chamar `/api/ml/auth/status` para verificar se há token válido; se sim, usar esse token; senão, fallback para `process.env.ML_ACCESS_TOKEN`
- Remover `ML_ACCESS_TOKEN` como obrigatório se OAuth estiver ativo

### 4.8 Atualizar `src/app/config/page.tsx`
- Adicionar seção "Mercado Livre - Autenticação"
- Botão "Conectar conta" (redireciona para `/api/ml/auth/login`)
- Botão "Desconectar" (chama `/api/ml/auth/revoke`)
- Exibir status: conectado (`user_id`, expiração) ou desconectado

## 5. Variáveis de ambiente
- `ML_APP_ID` (já existe)
- `ML_SECRET` (já existe)
- `ML_REDIRECT_URI` (novo; default `http://localhost:3000/api/ml/auth/callback` para dev)

## 6. Segurança
- `state` parameter com random string + TTL curto (ex: 5 min) para prevenir CSRF.
- PKCE `S256` obrigatório.
- `client_secret` nunca exposto ao cliente.
- `redirect_uri` deve ser exatamente igual ao registrado no app ML.
- Tokens armazenados em arquivo local do servidor, fora do versionamento.
- Cookies/session não usados (armazenamento file-system).

## 7. Tratamento de erros (conforme doc oficial)
- `invalid_client`: credenciais inválidas → log + erro genérico.
- `invalid_grant`: code/refresh_token expirado/revogado → limpar tokens, pedir nova autorização.
- `invalid_scope`: escopo inválido → verificar configuração do app ML.
- `forbidden (403)`: IP bloqueado ou token de outro usuário → log detalhado.
- `unauthorized_client`: app sem grant com usuário → pedir nova autorização.
- `unauthorized_application`: app bloqueado → alertar usuário.

## 8. Validação
1. Rodar `npm run dev`.
2. Acessar `/config`, clicar em "Conectar conta".
3. Autorizar no ML com usuário admin.
4. Verificar redirecionamento e status "Conectado".
5. Buscar produto e gerar link de afiliado usando token OAuth.
6. Desconectar e verificar fallback para token estático (se configurado).
7. Simular expiração de access_token (6h) e verificar refresh automático.
8. Testar error states (revogar permissão no painel ML e verificar comportamento).

## 9. Arquivos alterados/criados
**Criar**:
- `.data/ml-tokens.json` (adicionar `.data/` ao `.gitignore`)
- `src/lib/ml-auth.ts`
- `src/app/api/ml/auth/login/route.ts`
- `src/app/api/ml/auth/callback/route.ts`
- `src/app/api/ml/auth/refresh/route.ts`
- `src/app/api/ml/auth/revoke/route.ts`
- `src/app/api/ml/auth/status/route.ts`

**Modificar**:
- `src/lib/mercadolivre.ts`
- `src/app/config/page.tsx`
- `.env` (adicionar `ML_REDIRECT_URI` se necessário)
- `.gitignore` (adicionar `.data/`)
