# O Projeto — Radar de Achados

## Contexto

O **Radar de Achados** é uma aplicação web para descobrir produtos do Mercado Livre, ranqueá-los por "potencial de clique", gerar posts formatados e disponibilizá-los para cópia/cola em um Canal do WhatsApp.

O projeto nasceu da necessidade de automatizar a descoberta de ofertas e a geração de conteúdo para um canal de afiliados já existente, sem depender de APIs públicas de postagem (que não existem para WhatsApp Channels).

## Objetivos

1. **Descoberta:** Buscar produtos do Mercado Livre com filtros e ranqueamento automático.
2. **Geração de conteúdo:** Aplicar 10 modelos de post sobre um produto selecionado.
3. **Monetização:** Gerar links de afiliado rastreáveis via API oficial do Mercado Livre.
4. **Operação:** Fornecer uma rotina diária sugerida (9h, 12h, 15h, 19h, 21h) para publicação consistente.

## Público-alvo

- Operadores de canais de WhatsApp que divulgam ofertas do Mercado Livre.
- Afiliados que precisam de agilidade para testar e publicar produtos.
- Pequenos empreendedores que querem sistema de operação completo sem custos de plataforma.

## Escopo (MVP)

- **Sem backend próprio:** estado em `localStorage`; proxy serverless via Next.js API Routes.
- **Sem banco de dados:** histórico e configurações salvos no navegador.
- **Sem agendamento automático:** publicação manual via copiar/colar.

## Fora do escopo

- Integração direta com API de Canais do WhatsApp (não há API pública de postagem).
- Multi-usuário / SaaS.
- Pagamentos ou gestão financeira.
- App mobile nativo.

## Métricas de sucesso

- Tempo entre descoberta do produto e post copiado < 2 minutos.
- Posts reproduzem fielmente um dos 10 modelos do `pens.txt`.
- Copiar/colar produz texto idêntico ao preview.
