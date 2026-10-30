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
- Workflow com testes, build e publicação.
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
