# Guia de Contribuição

Padrões de branch, commit e checklist para contribuir com o Radar de Achados.

## Branch model

- `master` — branch principal, sempre deployable
- `feature/*` — novas features
- `fix/*` — correções de bugs

## Commits

Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição>
```

**Tipos:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Exemplos:**
```
feat(busca): adicionar filtro por preço máximo
fix(post): corrigir substituição de placeholders no template combo
docs(api): documentar cache TTL em /api/ml/search
```

## Checklist de PR

- [ ] `npm run lint` passa sem erros
- [ ] `npm run build` passa
- [ ] Alterações respeitam a estrutura de diretórios
- [ ] Novos templates/categorias seguem o formato existente
- [ ] Variáveis sensíveis não são commitadas (`.env.local` está no `.gitignore`)
- [ ] Documentação em `docs/` foi atualizada se aplicável

## Proposta de mudança

Para mudanças significativas (novas páginas, refatorings grandes, mudanças de stack), abra uma issue primeiro descrevendo:

- O problema a ser resolvido
- A solução proposta
- Alternativas consideradas
