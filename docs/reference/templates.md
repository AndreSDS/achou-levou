# Referência de Templates e Categorias

## 8 Categorias Fixas

| ID | Nome | Ícone | Template Padrão | Regras |
|-----|------|-------|-----------------|--------|
| `oferta-relampago` | OFERTA RELÂMPAGO | ⚡ | 2 | Promoções com tempo limitado |
| `achado-do-dia` | ACHADO DO DIA | 🔥 | 1 | Produto principal/destaque do dia |
| `menor-preco` | MENOR PREÇO | 💰 | 3 | Produtos baratos e populares |
| `tecnologia` | TECNOLOGIA | 📱 | 4 | Celulares, eletrônicos, gadgets |
| `casa-cozinha` | CASA & COZINHA | 🏠 | 5 | Utilidades domésticas |
| `achados-ate-50` | ACHADOS ATÉ R$50 | 🎁 | 6 | Produtos até R$50 |
| `mais-vendidos` | MAIS VENDIDOS | ⭐ | 7 | Produtos com alta demanda |
| `moda-calcados` | MODA & CALÇADOS | 👟 | 3 | Tênis, roupas, acessórios |

A sugestão de categoria é automática via `src/lib/categories.ts` (keywords + preço + vendas).

## 10 Templates de Post

Todos os templates estão definidos em `src/lib/templates.ts`.

| ID | Nome | Categoria | Placeholders |
|----|------|-----------|--------------|
| 1 | Achado do dia | ACHADO DO DIA | `[NOME DO PRODUTO]`, `[PREÇO]`, `[Benefício 1..3]`, `[LINK]` |
| 2 | Oferta relâmpago | OFERTA RELÂMPAGO | `[NOME DO PRODUTO]`, `[PREÇO]`, `[LINK]` |
| 3 | Produto barato | MENOR PREÇO | `[NOME DO PRODUTO]`, `[PREÇO]`, `[Principal vantagem]`, `[LINK]` |
| 4 | Tecnologia | TECNOLOGIA | `[NOME DO PRODUTO]`, `[PREÇO]`, `[Benefício x3]`, `[LINK]` |
| 5 | Casa e cozinha | CASA & COZINHA | `[NOME DO PRODUTO]`, `[PREÇO]`, `[LINK]` |
| 6 | Achados até R$50 | ACHADOS ATÉ R$50 | `[NOME]`, `[PREÇO]`, `[LINK]` |
| 7 | Mais vendido | MAIS VENDIDOS | `[NOME DO PRODUTO]`, `[PREÇO]`, `[Benefício x3]`, `[LINK]` |
| 8 | Urgência | OFERTA RELÂMPAGO | `[NOME DO PRODUTO]`, `[PREÇO]`, `[LINK]` |
| 9 | Comparação de preço | MENOR PREÇO | `[NOME DO PRODUTO]`, `[PREÇO]`, `[LINK]` |
| 10 | Combo | MAIS VENDIDOS | `[Produto x3]`, `[PREÇO]`, `[LINK]` (3 itens) |

### Mapeamento de placeholders

O `postBuilder.ts` substitui automaticamente:

- `[NOME DO PRODUTO]`, `[NOME]`, `[Produto]` → título do produto
- `[PREÇO]` → preço formatado em BRL
- `[LINK]`, `[SEU LINK DE AFILIADO]` → link de afiliado gerado
- `R$ XXX` → preço original (quando existir desconto)
