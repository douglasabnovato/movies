# Deploy · Movies (TMDB)

Plano de ação para publicar o catálogo de filmes em hospedagem gratuita.

## 1. Desafio

Publicar uma SPA em Create React App que consome a API da TMDB, sem deixar a chave no código-fonte, com deploy automático e sem custo.

## 2. Conteúdo

### Decisão de hospedagem

| Opção | Resultado |
|---|---|
| **GitHub Pages pela branch `gh-pages`, gerada pelo workflow existente (escolhida)** | O pipeline já existe (`.github/workflows/ci.yml`): testa, faz o build com o segredo e publica |
| Render Static Site | Funcionaria, mas duplicaria um pipeline que já está pronto |

### Como a chave da TMDB é tratada

- O código lê `REACT_APP_TMDB_KEY` do ambiente; o arquivo `.env` fica fora do Git.
- No deploy, o valor vem do **segredo do repositório** (Settings → Secrets and variables → Actions).
- Limite conhecido: em qualquer SPA, a chave vai dentro do JavaScript publicado. A chave atual também está no histórico do Git; mantê-la é um risco aceito (ADR-006).

### O que está pronto no projeto

- `HashRouter` (rotas funcionam no Pages sem configuração extra) e `"homepage"` apontando para o Pages.
- Workflow com testes, build e publicação, no Node 22 (`node-version: 22` no `ci.yml`).
- Versão do Node: 22.12 ou superior, a mesma faixa do `engines` no `package.json` e do README. O `@axe-core/playwright` do e2e exige o Node 22.12.
- Verificação: `npm ci` limpo, `npm run lint`, `npm run test:ci` e `npm run build`.

### Regra de publicação

Só um push na `main` publica o site, e somente depois de lint, testes e build passarem. PRs e a `developer-mvp` passam só pela verificação (ADR-007).

## 3. Solução (passo a passo)

### Etapa 1 · Conferir a chave

No GitHub, **Settings → Secrets and variables → Actions**: o segredo `REACT_APP_TMDB_KEY` precisa existir. Para trocar a chave no futuro, gere outra em https://www.themoviedb.org/settings/api e atualize o segredo.

### Etapa 2 · Validar localmente (Git Bash)

1. `cd /c/ambiente-projeto/ser-mvp/movies`
2. Criar `.env` na raiz com `REACT_APP_TMDB_KEY=<sua chave>` (a partir do `.env.example`).
3. `npm ci`
4. `npm run lint` e `npm run test:ci`
5. `npm start` e conferir busca, paginação e detalhe.

### Etapa 3 · Subir para o GitHub

1. `git status` (nenhum `.env` pode aparecer como adicionado)
2. Abrir um PR para a `main`; a aba **Actions** precisa ficar verde.
3. Fazer o merge; o job `deploy` publica o site.

### Etapa 4 · Conferir o GitHub Pages

1. **Settings → Pages → Deploy from a branch**: branch `gh-pages`, pasta **/ (root)**.
2. Abrir `https://douglasabnovato.github.io/movies/`.

### Etapa 5 · Conferir no ar

1. A lista de filmes populares carrega com pôsteres.
2. Busca por título e paginação funcionam; voltar a uma página já vista é instantâneo (cache).
3. Abrir um filme (`/#/movie/...`) e dar F5: a página continua.
4. Um id inexistente mostra a tela de 404 própria.

### Etapa 6 · Fechar

1. No GitHub, **About → Website**: colar a URL.

## 4. Deploy negado em 16/11/2026 (#98)

### O que aconteceu

O merge do PR #91 na `main` (16/11/2026) disparou o run [43799524150](https://github.com/douglasabnovato/movies/actions/runs/43799524150). Os jobs `build-and-test` e `e2e` passaram. O job `deploy` falhou no passo "Deploy para GitHub Pages" (`peaceiris/actions-gh-pages@v4`):

```
remote: Permission to douglasabnovato/movies.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/douglasabnovato/movies.git/': The requested URL returned error: 403
```

O site continua no ar com o build de 06/11/2026 (`"geradoEm":"2026-11-06T11:16:32.968Z"` no HTML, conferido em 16/11/2026).

### O que já foi conferido (16/11/2026, só leitura)

| Item | Comando | Resultado |
|---|---|---|
| Permissão padrão dos workflows | `gh api repos/douglasabnovato/movies/actions/permissions/workflow` | `default_workflow_permissions: write` |
| Permissão do job | `.github/workflows/ci.yml` | `deploy` declara `contents: write` (o topo do arquivo tem `contents: read`, e o job sobrescreve) |
| Regras na `gh-pages` | `gh api repos/douglasabnovato/movies/rules/branches/gh-pages` | `[]` (nenhuma regra) |
| Ruleset | `gh api repos/douglasabnovato/movies/rulesets` | só `principal-protegida`, na principal |
| Fonte do Pages | `gh api repos/douglasabnovato/movies/pages` | `build_type: legacy`, branch `gh-pages`, pasta `/` |

Nada no que um agente consegue ler explica o 403. O que falta conferir está em telas que só o responsável abre.

### Passo a passo do responsável

**Caminho 1: liberar o push na `gh-pages` (sem mudar o workflow).**
1. Settings → Actions → General → **Workflow permissions**: marcar "Read and write permissions" e clicar em **Save**, mesmo que já esteja marcado.
2. Settings → Rules → Rulesets: conferir se há regra de organização ou de conta que pegue todas as branches.
3. Actions → run 43799524150 → **Re-run failed jobs**. Com o job `deploy` verde, conferir o `geradoEm` do site com o comando de "Depois do deploy", abaixo.

**Caminho 2: publicar pelo Actions, sem push de branch.** Vale se o caminho 1 não resolver. Fonte: [GitHub Docs, usar workflows próprios com o Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
1. Settings → Pages → Build and deployment → **Source**: trocar "Deploy from a branch" por **GitHub Actions**.
2. Num PR, trocar o passo `peaceiris/actions-gh-pages@v4` do job `deploy` por `actions/configure-pages@v5`, `actions/upload-pages-artifact@v4` (com `path: ./build`) e `actions/deploy-pages@v4` (com `id: deployment`).
3. No job `deploy`: `permissions` com `pages: write` e `id-token: write`, e `environment` com `name: github-pages` e `url: ${{ steps.deployment.outputs.page_url }}`.
4. Esperar o CI do PR, mesclar e conferir o site como na Etapa 5.

O caminho 2 muda a fonte do Pages, que é configuração do responsável. Por isso o workflow ainda não foi trocado: com a fonte em "Deploy from a branch", o `deploy-pages` falharia.

### Depois do deploy

- `curl -s https://douglasabnovato.github.io/movies/ | grep -o '"geradoEm":"[^"]*"'` mostra a data do novo deploy.
- O agente mede o LCP no ar (#102) e registra no `docs/MVP.md`.
