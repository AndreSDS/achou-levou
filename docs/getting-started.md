# Getting Started — Radar de Achados

Este tutorial guia você do clone à primeira busca de produtos no Mercado Livre.

## Pré-requisitos

- **Node.js** >= 18.18
- **npm** >= 9
- Conta no Mercado Livre com programa de afiliados ativo (opcional para busca pública)

## Passo 1: Clone e instalação

```bash
git clone <repository-url>
cd app-publicaofertas
npm install
```

## Passo 2: Configure as credenciais

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.local.example .env.local
```

Preencha `.env.local`:

| Variável | Obrigatória | Descrição |
|----------|------------|-----------|
| `ML_APP_ID` | Sim (para links de afiliado) | App ID do seu app no Mercado Livre |
| `ML_SECRET` | Sim (para links de afiliado) | Secret do seu app no Mercado Livre |
| `ML_ACCESS_TOKEN` | Sim (para links de afiliado) | Token de acesso OAuth do ML |
| `ML_AFFILIATE_ID` | Não | Seu ID de afiliado (também pode ser configurado na UI em `/config`) |

> **Nota:** A busca pública de produtos funciona sem credenciais. Para gerar links de afiliado, configure as três primeiras variáveis.

## Passo 3: Execute o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Passo 4: Primeira busca

1. Acesse **Busca** no menu ou [http://localhost:3000/busca](http://localhost:3000/busca)
2. Digite um termo (ex: `fone de ouvido`)
3. Clique em **Buscar**
4. Os resultados aparecem ranqueados por score de "achado"

## Passo 5: Gere seu primeiro post

1. Clique em **Usar no post** em qualquer card de produto
2. Escolha uma **categoria** e um **modelo**
3. (Opcional) Cole um link de afiliado ou configure em `/config`
4. Clique em **Gerar post**
5. Clique em **Copiar** e cole no WhatsApp

## Próximos passos

- Leia **[O Projeto](./explanation/project.md)** para entender o contexto e objetivos.
- Leia **[Arquitetura](./explanation/architecture.md)** para entender como o sistema funciona.
- Explore os **[Templates e Categorias](./reference/templates.md)** para conhecer os formatos de post disponíveis.
