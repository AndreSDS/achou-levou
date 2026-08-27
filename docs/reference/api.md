# Referência de API

Documentação dos endpoints servidos pelo app.

## Base URL

```
http://localhost:3000/api/ml
```

## Autenticação

Nenhuma autenticação é requerida no cliente. As credenciais do Mercado Livre (`ML_APP_ID`, `ML_SECRET`, `ML_ACCESS_TOKEN`) ficam no servidor via `.env.local`.

---

## GET /api/ml/search

Proxy para a busca pública de produtos do Mercado Livre.

### Query Params

| Param | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `q` | `string` | Não | Termo de busca |
| `category` | `string` | Não | ID da categoria ML |
| `price_min` | `number` | Não | Preço mínimo |
| `price_max` | `number` | Não | Preço máximo |
| `order` | `string` | Não | Ordenação: `relevance`, `price_asc`, `price_desc`, `sold_quantity` |

### Response

```json
{
  "paging": { "total": 100, "offset": 0, "limit": 20 },
  "results": [
    {
      "id": "MLB1234567890",
      "title": "Fone de Ouvido Bluetooth",
      "price": 99.9,
      "original_price": 199.9,
      "thumbnail": "https://...",
      "permalink": "https://...",
      "shipping": { "free_shipping": true },
      "sold_quantity": 150,
      "category_id": "MLB1051",
      "condition": "new",
      "available_quantity": 50,
      "score": 78.5,
      "suggestedCategory": { ... },
      "discount": 0.5,
      "reasons": ["Desconto de 50%", "Frete grátis"]
    }
  ]
}
```

### Cache

A resposta é cacheada em memória por **60 segundos** por combinação de parâmetros.

---

## POST /api/ml/link

Gera um link de afiliado para um item do Mercado Livre.

### Request Body

```json
{
  "itemId": "MLB1234567890",
  "affiliateId": "123456789"
}
```

### Response

```json
{
  "url": "https://www.mercadolivre.com.br/..."
}
```

### Erros

| Status | Descrição |
|--------|-----------|
| 400 | `itemId` ou `affiliateId` ausentes |
| 500 | Erro ao chamar API do ML (credenciais ausentes ou inválidas) |
