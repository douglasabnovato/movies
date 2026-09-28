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
- Limite conhecido: em qualquer SPA, a chave vai dentro do JavaScript publicado. Para a TMDB (leitura pública, cota por chave) isso é aceitável; o que não pode é a chave ficar no histórico do Git, por isso ela precisa ser **revogada e trocada**.

### O que está pronto no projeto

- `HashRouter` (rotas funcionam no Pages sem configuração extra) e `"homepage"` apontando para o Pages.
- Workflow com testes, build e publicação.
- Verificação feita antes da entrega: `npm ci` limpo, 32 testes passando (7 suítes) e build de produção gerado.

### Melhoria recomendada no workflow

Hoje o workflow também publica quando há push em `developer-mvp`, o que sobrescreve a versão da `main`. Para publicar só a `main`, troque no `.github/workflows/ci.yml` a condição do passo "Deploy para GitHub Pages" por:

```yaml
        if: github.ref == 'refs/heads/main'
```

## 3. Solução (passo a passo)

### Etapa 1 · Trocar a chave vazada

1. Em https://www.themoviedb.org/settings/api, **gerar uma chave nova** e invalidar a antiga (a antiga está no histórico do Git em `src/.env`).
2. No GitHub, **Settings → Secrets and variables → Actions**: criar ou editar o segredo `REACT_APP_TMDB_KEY` com a chave nova.

### Etapa 2 · Validar localmente (Git Bash)

1. `cd /c/ambiente-projeto/ser-mvp/movies`
2. Criar `.env` na raiz com `REACT_APP_TMDB_KEY=<chave nova>` (a partir do `.env.example`).
3. `npm ci`
4. `npm test -- --watchAll=false` (32 testes)
5. `npm start` e conferir busca, paginação e detalhe.

### Etapa 3 · Subir para o GitHub

1. `git rm --cached src/.env` (tira do versionamento o arquivo antigo com a chave)
2. `git status` (nenhum `.env` pode aparecer como adicionado)
3. `git add -A`
4. `git commit -m "refactor: MVP — cache TTL, AbortController, erros tipados, a11y, testes e docs de deploy"`
5. `git push`
6. Aba **Actions**: o workflow precisa ficar verde (testes, build e deploy).

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
