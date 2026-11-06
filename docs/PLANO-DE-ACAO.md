# Plano de ação — Movies (TMDB Explorer)

> Histórico do ciclo de 27/09/2026 e plano do ciclo de 03/11/2026 (no fim). O estado dos critérios fica só em [`MVP.md`](MVP.md).

Priorização por **MoSCoW** e ordenação por **ganho ÷ esforço** (esforço em pontos: 1 = até 15 min, 2 = até 30 min, 3 = até 1 h).

| # | Prioridade | Tarefa | Defeito | Critério | Ganho | Esforço | Status |
|---|---|---|---|---|---|---|---|
| T01 | Must | Remover a chave do código; erro tipado `config`; criar `.env.example` | D1 | C4, C9 | Alto | 1 | ✅ Feito |
| T02 | Must | Estado de erro com "Tentar novamente" na Home e no Detalhe; 404 distinto de falha de rede | D2 | C2 | Alto | 2 | ✅ Feito |
| T03 | Must | Cancelar requisições obsoletas com `AbortController` (hook `useFetch` reescrito) | D3, D8 | C7, C1 | Alto | 2 | ✅ Feito |
| T04 | Must | Placeholder local no lugar de `via.placeholder.com` | D4 | C2, C8 | Médio | 1 | ✅ Feito |
| T05 | Must | Corrigir data um dia antes na Home (usar `formatDate`) | D6 | C1 | Médio | 1 | ✅ Feito |
| T06 | Should | Cache TTL (5 min, 100 entradas) na camada de serviço | — | C8 | Médio | 2 | ✅ Feito |
| T07 | Should | Detalhe com uma requisição (`append_to_response`) | D7 | C8 | Médio | 1 | ✅ Feito |
| T08 | Should | Acessibilidade: `aria-current`, rótulos da paginação, botão de voltar com nome, `alt` dos pôsteres | D5 | C3 | Médio | 1 | ✅ Feito |
| T09 | Should | Testes: cache, serviço, hook, paginação e estados da Home | — | C6 | Alto | 3 | ✅ Feito |
| T10 | Should | `document.title` por página (SEO básico, parte da Issue #53) | — | C1, C10 | Baixo | 1 | ✅ Feito |
| T11 | Could | `loading="lazy"`, `width`/`height` nas imagens (CLS) e trailer via `youtube-nocookie` | — | C8, C4 | Baixo | 1 | ✅ Feito |
| T12 | Should | Corrigir o README (status das issues, imagem inexistente, seção de configuração) | D9 | C10 | Médio | 1 | ✅ Feito |
| T13 | Must | `src/.env` saiu do Git (`fix/ci-filtros-env`); a chave não será trocada por enquanto (ADR-006) | D1 | C4 | Alto | 1 | ✅ Decidido |
| T14 | Won't (agora) | Migrar CRA → Vite; TanStack Query; favoritos; E2E | — | C7, C6 | — | — | Roadmap |

## Sequência de execução

1. T01 → T03 → T02 (segurança e corretude antes da interface).
2. T04, T05, T07, T06 (dados e desempenho).
3. T08, T10, T11 (acessibilidade e SEO).
4. T09 (testes que travam o comportamento acima).
5. T12 (documentação).

## Definição de pronto

- `npm test -- --watchAll=false` verde.
- `npm run build` sem erros.
- Nenhuma ocorrência de chave de API em `src/` (`grep -r "api_key" src` só encontra o nome do parâmetro).

## Ciclo de 03/11/2026

> Branch `feature/2026-11-03` → `developer/sprint-2026-11-05` → `main` (PRs #81 e #82). Nível: Vitrine (N2), 12 critérios.

### Produto

**Problema e público.** Quem quer escolher um filme precisa achar um que valha abrir, buscando por nome ou filtrando por gênero, no celular ou no computador.

**Hipótese e meta.** Buscar ou filtrar basta para achar um filme e abrir a ficha. Meta na seção 5 do `MVP.md`: 4 de 5 pessoas concluem em até 2 minutos (#59) e, com medição, 50% das sessões chegam ao detalhe (#58).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| A imagem do LCP precisa estar no HTML, com prioridade alta | O build grava no `index.html` a primeira página de populares e o primeiro pôster, com `preload` e `fetchpriority="high"`. A espera para começar a baixar o pôster caiu para 0 ms | [web.dev: Fetch Priority](https://web.dev/articles/fetch-priority), [Unlighthouse: resource load delay](https://unlighthouse.dev/learn-lighthouse/lcp/resource-load-delay) |
| "Onde assistir" é o passo seguinte de quem achou o filme | A TMDB tem `/movie/{id}/watch/providers`, com dados da JustWatch, e pede crédito à JustWatch onde eles aparecem. Virou issue (#84) | [Docs de um cliente da TMDB: watch providers](https://lorenzopant-tmdb-docs.vercel.app/docs/api-reference/movies/watch-providers), [Fórum da TMDB](https://www.themoviedb.org/talk/633e6e73fb8346007936fb52) |
| Guardar opções para decidir depois | Favoritos no navegador, sem conta. Virou issue (#85) | Plano de 27/09/2026 (T14, "favoritos") |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Retrato da Home no build (lista e pôster no HTML) | Alto | Médio | Este ciclo (#81) |
| 2 | CI também nos PRs para a `developer` e testes dos scripts do build | Alto | Baixo | Este ciclo (#81) |
| 3 | Critério 10 conforme a decisão 3 (sem proteção, "Parcial") | Alto | Baixo | Este ciclo |
| 4 | Atraso de renderização do LCP (2,3 a 2,8 s) | Alto | Médio | Issue (#57) |
| 5 | Renovar o retrato todo dia | Médio | Baixo | Responsável (#83) |
| 6 | Proteger a `main` | Alto | Baixo | Responsável (#73) |
| 7 | Teste com 5 pessoas | Alto | Médio | Responsável (#59) |
| 8 | Medição de uso | Médio | Baixo | Responsável (#58) |
| 9 | Onde assistir | Médio | Médio | Issue (#84) |
| 10 | Favoritos | Médio | Médio | Issue (#85) |

**Fora do escopo.** Proxy da chave, troca de hospedagem para SSR, contas de usuário.

### Engenharia

**Arquitetura.** React (CRA) com `HashRouter`, publicado no GitHub Pages pelo job `deploy` do CI. Depois do build, `scripts/inline-css.js` põe o CSS no HTML e `scripts/home-snapshot.js` grava a primeira página de populares (só os campos da Home) e o primeiro pôster no esqueleto. O `index.html` usa o retrato quando ele tem menos de 48 h; senão, busca a lista como antes. `tmdbApi.takeHomePreload` entrega a lista ao React uma única vez.

**Riscos.**
- O retrato só é renovado a cada push na `main`. Depois de 48 h, a Home volta a depender da API para o pôster. A publicação diária no workflow foi bloqueada por permissão neste ciclo (#83).
- O LCP medido continua sendo a imagem renderizada pelo React, e não a do esqueleto: o atraso agora é de renderização, não de download (#57).
- O retrato entra no HTML: o JSON é escapado (`<` vira `<`) e só caminho de pôster no formato da TMDB entra num atributo, com teste.
- A chave TMDB no build é risco aceito (ADR-006).

**Qualidade.**
- Testes: os de unidade e o Playwright de antes, mais 7 testes `node --test` dos scripts do build, agora no CI.
- Desempenho: Lighthouse 12.8.2 local, móvel, 06/11/2026: 3,33, 3,68 e 3,28 s, mediana 3,33 s; espera de download 0 ms, atraso de renderização 2,3 a 2,8 s.
- Acessibilidade: Lighthouse 100 nas 3 execuções.

**Definição de pronto.** Lint, `test:ci`, `test:scripts`, build e e2e verdes no PR; `docs/MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.**
1. Retrato da Home no build, com revisão (posição depois do `<meta charset>` e validação do caminho do pôster) e testes.
2. CI nos PRs para a `developer` e passo `test:scripts`.
3. `docs/MVP.md` com o critério 10 conforme a decisão 3 e as medições de 06/11/2026.
4. README com a seção do ciclo.

**Vira issue.** #83 (responsável), #84 e #85 (agente). Seguem abertas: #57 (agente; o celular real é do responsável), #58, #59 e #73 (responsável).
