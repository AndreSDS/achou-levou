# Guia de Configuração

Como configurar o ambiente, credenciais do Mercado Livre e preferências do usuário.

## Variáveis de ambiente

Todas as variáveis sensíveis ficam em `.env.local` (não versionado).

### Credenciais do Mercado Livre

```env
ML_APP_ID=seu_app_id_aqui
ML_SECRET=seu_secret_aqui
ML_ACCESS_TOKEN=seu_access_token_aqui
ML_AFFILIATE_ID=seu_affiliate_id_aqui
```

- `ML_APP_ID`, `ML_SECRET` e `ML_ACCESS_TOKEN` são obrigatórios para gerar links de afiliado.
- `ML_ACCESS_TOKEN` expira; quando expirar, gere um novo no painel do Mercado Livre e atualize `.env.local`.
- `ML_AFFILIATE_ID` também pode ser configurado pela UI em `/config` (salvo em `localStorage`).

### Como obter as credenciais

1. Acesse [developers.mercadolibre.com](https://developers.mercadolibre.com/)
2. Crie um aplicativo no seu painel
3. Copie `App ID` e `Secret Key`
4. Gere um `Access Token` via OAuth

## Configuração via UI

Acesse `/config` para:

- Informar seu `ML Affiliate ID` (salvo em `localStorage`)
- Visualizar as credenciais necessárias no `.env.local`

## Cache da API

O proxy `/api/ml/search` mantém um cache em memória (TTL de 60s por query) para respeitar os rate limits do Mercado Livre. Não há configuração exposta; se precisar alterar, edite `src/app/api/ml/search/route.ts`.
