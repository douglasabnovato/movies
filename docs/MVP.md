# MVP — critérios e tarefas

> Fonte única do estado. Criado em 30/10/2026 e revisto em 18/11/2026 (ciclo de 18/11/2026: critério 7 medido no ar; antes, ciclo de 16/11/2026; às 12:00, critério 9 com os alertas do Dependabot ligados; às 14:39, alertas de desenvolvimento aceitos na ADR-009; plano em [`PLANO-DE-ACAO.md`](PLANO-DE-ACAO.md)). As tabelas anteriores estão em [Histórico](#histórico). Complementa a rubrica técnica de `docs/ANALISE.md`, medindo também se o produto consegue aprender com o uso real.

**Nível:** Vitrine (N2). Valem os 12 critérios.

**Resumo:** 11 de 12 aplicáveis atendidos

**Finalizado:** sim — falta só o critério 5, que depende do responsável (conta do GoatCounter, #58, com `depende-do-responsavel`)

Revisão de 18/11/2026, 20:30 (regra das issues). O critério 7 passou a "Atende": o site serve o build de 16/11/2026 (`"geradoEm":"2026-11-16T18:13:30.266Z"`, `main.f917feb2.js`, run 43926283234 do PR #109), e o Lighthouse móvel no ar deu mediana de 2,49 s nas 3 primeiras execuções válidas (2,35 s nas 5), com o pôster do esqueleto como LCP (#102). Falta só o critério 5, que depende do responsável (#58). Pela definição de pronto do portfólio (critério que só depende do responsável, com issue aberta), isso dá **Finalizado: sim**. O critério 9 segue "Atende" com 23 alertas abertos, todos decididos: 21 na ADR-009 e 2 na ADR-008; os 38 do PR #108 fecharam com o merge na `main`.

## Produto

- **Problema:** escolher um filme para ver hoje exige descobrir, filtrar e abrir a ficha sem ajuda.
- **Público:** quem quer escolher um filme para ver hoje.
- **Hipótese:** acreditamos que quem chega ao site quer descobrir um filme, e que buscar ou filtrar por gênero basta para encontrar um que valha abrir. Saberemos quando, com no mínimo 100 visitas à Home, os eventos `abriu-filme` somarem ao menos 50% dessas visitas.
- **Métrica:** chegada ao detalhe (eventos `abriu-filme` ÷ visitas à Home), medido por GoatCounter (falta a conta, #58) — meta: 50% ou mais, com no mínimo 100 visitas à Home. Em sessão observada com 5 pessoas (#59), a meta é ao menos 4 concluírem em até 2 minutos. Metas escolhidas por julgamento, a rever depois da primeira medição (seção 5).

## 1. Critérios

| # | Critério | Como verificar | Situação em 16/11/2026 (ciclo de 16/11/2026) |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: "quem quer escolher um filme para ver hoje precisa descobrir, filtrar e abrir a ficha sem ajuda" (seção 5, revista em 16/11/2026) |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: aposta, meta e "saberemos quando" na seção 5 (revista em 16/11/2026) |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende: `cd e2e && E2E_PORT=4391 npx playwright test`, 16/11/2026: 12 testes, 0 falhas, com o teste `filtra por gênero, abre o detalhe e volta com o filtro` (agora confere também onde assistir); no CI, job `e2e` verde no run [43823541888](https://github.com/douglasabnovato/movies/actions/runs/43823541888) do PR #103 (16/11/2026). No ar, 16/11/2026: `curl` no site deu HTTP 200. O teste com pessoas é validação de produto (#59) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: seção 4 e "Fora do escopo" no `PLANO-DE-ACAO.md` (16/11/2026) |
| 5 | Medição de uso | A métrica principal é coletada | Parcial: código do GoatCounter pronto (sem cookie, só no site publicado; rotas e evento `abriu-filme`), com testes no Jest e no e2e. O site no ar já tem o código (18/11/2026: `goatcounter.com/count` no `main.f917feb2.js` publicado), mas a conta não existe (`curl` em `douglasabnovato.goatcounter.com` deu 400, 18/11/2026; #58). Sem painel com visitas, não atende |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: `npx react-scripts test --watchAll=false`, 16/11/2026: 82 testes, 0 falhas, entre eles falha de rede (`Home.test.js` e `Details.test.js`), filme inexistente (`Details.test.js`), lista vazia e página além do total (`Home.test.js`) e o estado de carregando (`useFetch.test.js`); e2e `com retrato vencido e a API fora, o esqueleto volta ao bloco cinza` |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Atende no ar: `npx lighthouse@12.8.2 https://douglasabnovato.github.io/movies/ --only-categories=performance --chrome-flags="--headless --no-sandbox"`, 18/11/2026 (20h30 a 20h33): 2,49, 2,34 e 2,53 s nas 3 primeiras execuções válidas (mediana 2,49 s); mais 2 válidas deram 2,35 e 2,32 s (mediana das 5: 2,35 s). TBT de 5 a 62 ms; FCP observado de 210 a 352 ms. Elemento do LCP: `div#shell-first > img`, o pôster do esqueleto. O Lighthouse só informou o elemento na 5ª execução; nas 4 primeiras, a auditoria `largest-contentful-paint-element` veio como `notApplicable`. Uma carga à parte no Playwright (Pixel 5, no site, 18/11/2026) confirmou o mesmo elemento pelo `PerformanceObserver`, aos 676 ms. Build medido: `main.f917feb2.js`, retrato de 16/11/2026 18:13 UTC (já vencido, com 53 h: a lista veio da API). A margem é pequena; o confronto em celular real segue com o responsável (#57). Detalhes na seção 7 |
| 8 | Acessibilidade básica | axe e teclado | Atende: `cd e2e && E2E_PORT=4391 npx playwright test`, 16/11/2026, com `e2e/tests/acessibilidade.spec.js` (axe WCAG A e AA na Home, na lista filtrada e no detalhe, largura de desktop) e o teste `conclui o fluxo só com o teclado, com o foco visível`: 12 testes, 0 falhas. O axe achou `link-in-text-block` no crédito à JustWatch, corrigido neste ciclo. O app não tem tema escuro próprio (sem `prefers-color-scheme` no CSS); o axe roda só no claro. Leitor de tela não testado |
| 9 | Segurança e conformidade | Riscos decididos; termos da API cumpridos | Atende: `gh api "repos/douglasabnovato/movies/dependabot/alerts?state=open&per_page=100"`, 18/11/2026: 23 alertas abertos, todos no `package-lock.json` (6 altos, 14 médios, 3 baixos). 2 do `react-router` 6.30.6 (runtime) com risco aceito na [ADR-008](adr/ADR-008-react-router-6-risco-aceito.md) até a #100: o app não usa SSR e só gera links internos. 21 de desenvolvimento, presos ao `react-scripts` 5.0.1, aceitos na [ADR-009](adr/ADR-009-alertas-de-desenvolvimento-aceitos.md) (os mesmos números de alerta da ADR). 0 sem decisão. Os 38 corrigidos no PR #108 fecharam com o merge na `main` (16/11/2026). `npm audit --omit=dev`, 18/11/2026: só os 2 moderados do `react-router` (ADR-008); `cd e2e && npm audit`: 0 vulnerabilidades. Chave da TMDB mantida por decisão (ADR-006); atribuição à TMDB e crédito à JustWatch publicados (crédito conferido no detalhe do site em 18/11/2026) |
| 10 | Entrega confiável | Publicação só depois de CI verde | Atende: `gh api repos/douglasabnovato/movies/rulesets/26932548`, 16/11/2026: `principal-protegida` ativo na principal, com `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks` (`build-and-test` e `e2e`); a publicação só sai do job `deploy`, depois dos dois |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 16/11/2026, local: Jest com 82 testes, 0 falhas; `npm run test:scripts` com 7 testes, 0 `skipped`; e2e com 12 testes, 0 falhas. No CI, jobs `build-and-test` e `e2e` verdes no run [43823541888](https://github.com/douglasabnovato/movies/actions/runs/43823541888) do PR #103 (16/11/2026) |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende: README ("Como executar") conferido contra o `package.json` em 16/11/2026 (`npm ci`, `npm start`, `npm test`, `npm run build`); o `engines` (`>=22.12`), o README, o `docs/DEPLOY.md` e o CI (Node 22) citam a mesma versão desde 18/11/2026 (#101) |

## 2. Tarefas obrigatórias

| # | Tarefa | Situação |
|---|---|---|
| 1 | Fazer da URL a fonte única dos filtros | Feito |
| 2 | Tratar página além do total | Feito |
| 3 | Proteger a `main` e exigir CI verde | Feito pelo responsável: ruleset com `build-and-test` e `e2e` (conferido em 16/11/2026 e de novo em 18/11/2026; a #73 fecha com ele) |
| 4 | Adicionar a atribuição exigida pela TMDB e trocar a marca principal | Feito |
| 5 | Reduzir o LCP no celular para até 2,5 s | Feito no ar: mediana de 2,49 s em 18/11/2026 (#102); falta só o celular real, com o responsável (#57) |
| 6 | Definir a hipótese e medir a chegada ao detalhe | Hipótese e meta definidas; GoatCounter no código e no site; falta a conta (#58) |
| 7 | Corrigir README e planos | Feito |
| 8 | Decidir as issues #14, #18, #37 e #44 | Decidido: #14, #18 e #37 fechadas; #44 no PR #54 |
| 9 | Testar com 5 pessoas e registrar o aprendizado | Com o responsável: roteiro em `docs/TESTE-USUARIOS.md` (#59) |

## 3. Tarefas recomendadas

- Confirmar a largura de 768 px em um aparelho real. A causa dos 16 px a mais foi encontrada e corrigida no #53, com teste no navegador.
- Testar com leitor de tela. O teclado está coberto no #53.
- Prettier e Husky estão no #51. O Axios fica de fora: `fetch` na camada de serviço já resolve, e trocar não traz ganho ao usuário.
- Atualizar o Node nos runners e apagar as branches já mergeadas.
- Teste Playwright do fluxo principal: no #53.

## 4. Fora do MVP

Tema 007, pixel perfect, cartão por filme e SEO com outra hospedagem, proxy da chave, MSW, Vite, TypeScript e CSS Modules. A ordem técnica está em `docs/PLANO-ESTRATEGICO.md`.

## 5. Hipótese e meta

**Problema e público:** quem quer escolher um filme para ver hoje precisa descobrir, filtrar e abrir a ficha sem ajuda.

**Hipótese:** acreditamos que quem chega ao site quer descobrir um filme, e que buscar ou filtrar por gênero basta para encontrar um que valha abrir.

**Saberemos quando:** com no mínimo 100 visitas à Home no GoatCounter, os eventos `abriu-filme` somarem ao menos 50% dessas visitas (eventos ÷ visitas à Home; o GoatCounter conta os dois em separado).

**Métrica:** chegada ao detalhe = visitas com o evento `abriu-filme` ÷ visitas à Home. É a leitura proposta no roteiro do vídeo 12 (#97). Limite: quem entra direto pela ficha de um filme infla a razão.

| Teste | Meta | Se não atingir |
|---|---|---|
| 5 pessoas, sem ajuda: "encontre um filme para ver hoje e abra a ficha" (#59) | Ao menos 4 concluem em até 2 minutos | Rever a busca e o filtro antes de qualquer função nova |
| Uso real, no GoatCounter | Eventos `abriu-filme` ÷ visitas à Home de ao menos 50%, com no mínimo 100 visitas à Home | Olhar onde as pessoas param |

As metas são um ponto de partida escolhido por julgamento, sem dados anteriores, e devem ser revistas depois da primeira medição.

**Ferramenta:** GoatCounter, sem cookie, com o código `douglasabnovato` (decisão D5 de 10/11/2026). O código está na `main` e no site desde 16/11/2026. Ainda não há dado: a conta não existe (#58).

## 6. Cobertura dos testes

Medida em 31/10/2026, com a `main` e os PRs #47 a #54 reunidos: 55 testes, com 93,9% de instruções e 94,14% de linhas.

| Arquivo da #36 | Instruções | Linhas |
|---|---:|---:|
| `hooks/useFetch.js` | 95% | 100% |
| `services/cache.js` | 100% | 100% |
| `services/tmdbApi.js` | 93,02% | 92,85% |

A meta da #36, de 70% em hooks e serviços, está cumprida. O ponto mais baixo fora dela é `utils/images.js`, com 60%.

**Decisão sobre o MSW:** não adotar agora. Os testes já simulam `fetch` e cobrem sucesso, erros e cancelamento, e o Playwright cobre o navegador com a rede simulada. O MSW traria mais uma camada para testar o mesmo caminho.

## 7. Medições do LCP móvel

Lighthouse 12.8.2 local, sem ambiente controlado, no site publicado. O resultado varia entre execuções.

| Versão | Execução 1 | Execução 2 | Execução 3 | Mediana | Nota de desempenho |
|---|---|---|---|---|---|
| Antes do #56 | 3,5 s | 3,7 s | 4,6 s | 3,7 s | 0,77 a 0,84 |
| Depois do #56 | 3,8 s | 3,1 s | 3,4 s | 3,4 s | 0,80 a 0,86 |
| Antes do #68 | 3,98 s | 4,49 s | 4,40 s | 4,40 s | 0,67 a 0,73 |
| Depois do #70 | 3,43 s | 3,16 s | 3,38 s | 3,38 s | 0,83 a 0,89 |
| Depois do #81 (06/11) | 3,33 s | 3,68 s | 3,28 s | 3,33 s | 0,66 a 0,83 |
| Local, `main` (09/11) | 3,93 s | 3,35 s | 4,22 s | 3,93 s | 0,80 a 0,88 |
| Local, PR #88 (09/11) | 3,02 s | 2,93 s | 3,51 s | 3,02 s | 0,59 a 0,92 |
| Local com gzip, PR #92 (09/11) | 2,77 s | 2,38 s | 2,40 s | 2,38 s (5 execuções; as outras: 2,30 e 2,26 s) | 0,92 a 0,98 |
| No ar, build de 06/11 (16/11) | 3,22 s | 3,07 s | 3,32 s | 3,22 s (uma 4ª válida: 3,47 s; a 1ª execução, com FCP observado de 11,3 s, foi descartada) | 0,87 a 0,91 |
| No ar, build de 16/11 (18/11) | 2,49 s | 2,34 s | 2,53 s | 2,49 s (mais 2 válidas: 2,35 e 2,32 s; mediana das 5: 2,35 s) | 0,97 a 0,98 |

**06/11/2026:** com o retrato no HTML, a espera para começar a baixar o pôster caiu para 0 ms, mas o LCP medido é a imagem que o React renderiza, com atraso de renderização de 2,3 a 2,8 s. O próximo passo é fazer o esqueleto contar como LCP ou o React montar antes (#57). O retrato vale 48 h e só é renovado a cada push na `main` (#83).

A meta de 2,5 s não foi atingida. Com o esqueleto no HTML, o CLS caiu de 0,10 a 0,13 para 0. O Lighthouse simula a rede lenta: o LCP observado sem essa simulação foi de 1,2 s na primeira execução final, mas o simulado é o que vale para a meta. O pôster depende de uma chamada à API feita por JavaScript, e esse é o limite restante; a #57 segue a partir daí.

**09/11/2026:** o retrato publicado era de 06/11 e já tinha vencido (48 h, #83). A causa do atraso de renderização foi achada no navegador: o React apagava o esqueleto antes de o pôster dele pintar, então o pôster do esqueleto nunca virava LCP, e o LCP passava a ser o pôster do React (176 × 264 px, menor que o do esqueleto, de 182 × 273 px). No PR #88, o React espera a entrada de LCP do pôster do esqueleto (até 2,5 s, ou 400 ms depois do load). Medição local: build de produção da `main` e do PR, com o retrato de 06/11 regravado com data atual, servidos em `localhost`, Lighthouse 12.8.2 móvel. Antes, o elemento de LCP foi sempre o pôster do React; depois, o do esqueleto em 2 de 3 execuções (a terceira teve 6,4 s de bloqueio de CPU por outros processos e caiu no limite). O que sobra é o download do pôster na rede simulada (1,8 a 2,1 s); no ar, em 06/11, ele levou até 0,28 s. Medir no ar depois do merge.

**09/11/2026, ciclo de 09/11 (PR #92).** O 3,02 s do PR #88 foi medido com um servidor sem compressão: o `main.js` chegava com 181 KB, e não com os 61 KB do gzip que o Pages usa. Com o mesmo build servido com gzip (`serve`), a `developer/sprint-2026-11-12` deu 2,91, 2,28, 2,36, 2,25, 2,28, 2,32 e 2,28 s nas execuções válidas (mediana 2,28 s), mas em 3 das 10 execuções com a CPU da máquina em 100% o esqueleto saiu antes de o pôster pintar, e o LCP voltou a ser o pôster do React (3,36 a 4,03 s). Este ciclo fez a espera contar a folga depois de `img.decode()` e de um quadro: na série final, o pôster do esqueleto foi o LCP nas 5 execuções (2,77, 2,38, 2,40, 2,30 e 2,26 s; mediana 2,38 s; TBT de 112 a 292 ms). Fases típicas: TTFB 0,46 s, espera 0, download do pôster 1,1 a 1,8 s, atraso de renderização 0,13 a 1,18 s. Também foi testado baixar o `main.js` só depois do pôster: a mediana não mudou (2,29 s) e a ideia foi desfeita. Execução válida = FCP observado abaixo de 2 s e sem `runtimeError`.

**18/11/2026, no ar (#102).** Primeira medição no site com o código do PR #92: `curl` mostrou `"geradoEm":"2026-11-16T18:13:30.266Z"` e o `main.f917feb2.js` do deploy do PR #109 (run 43926283234). Lighthouse 12.8.2 móvel, `--headless --no-sandbox`, `timeout 150`, 5 execuções seguidas, todas válidas: 2,49, 2,34, 2,53, 2,35 e 2,32 s. Fases: TTFB de 95 a 231 ms, espera de 8 a 50 ms, download do pôster de 560 a 588 ms, atraso de renderização de 59 a 65 ms. O retrato já tinha 53 h, então a Home buscou a lista na API, como manda o caminho do retrato vencido (#89). Mesmo assim, o LCP foi o pôster do esqueleto: no Playwright (Pixel 5), o `PerformanceObserver` registrou `#shell-first img` aos 676 ms, com o mesmo pôster do primeiro filme que o React mostrou. A meta de 2,5 s foi atingida, com pouca margem.

## 8. Verificação de acessibilidade

**16/11/2026:** a seção "Onde assistir no Brasil" do detalhe entrou no axe. Ele achou `link-in-text-block` no link da JustWatch, que só se distinguia pela cor; o link ganhou sublinhado.

Em 02/11/2026, o axe-core entrou no Playwright (`e2e/tests/acessibilidade.spec.js`), cobrindo página inicial, lista filtrada e detalhe. Ele achou um defeito real: o gênero selecionado tinha texto branco sobre laranja, com contraste insuficiente. O texto passou a ser escuro. A ferramenta não substitui o teste com leitor de tela.

## 9. Melhoria do processo

Medir o gargalo antes de corrigir: a fase de cada métrica mostra o limite do ganho. Aqui, adiantar a imagem reduziu a espera, mas o FCP continuou como piso.

## Histórico

- 20/11/2026: bloco Produto padronizado, sem mudar critérios.

### Revisão de 18/11/2026, 20:30 (critério 7 no ar)

Só o critério 7 mudou. Antes: "Não atende no ar", com 3,22 s no build de 06/11/2026; **Finalizado: não** (10 de 12). Depois: "Atende", com mediana de 2,49 s no build de 16/11/2026 (#102); **Finalizado: sim** (11 de 12), com o critério 5 dependendo do responsável (#58). O critério 9 só teve a contagem atualizada: 23 alertas abertos, todos decididos.

### Revisão de 16/11/2026, 14:39 (regra geral por ADR)

Só o critério 9 mudou. Antes: "Parcial" por 21 alertas sem correção nem decisão (#107); **Finalizado: não** (9 de 12). Depois: "Atende", com os 21 aceitos na ADR-009 (só desenvolvimento), 2 na ADR-008 e 38 corrigidos na sprint-19 (PR #108); **Finalizado: não** (10 de 12), agora só pelo critério 7, que espera a nova medição da #102 depois da volta do deploy (#98).

### Revisão de 16/11/2026, 12:00 (alertas do Dependabot)

Só o critério 9 mudou de motivo, e o Finalizado caiu. Antes: "Parcial" porque os alertas estavam desligados (403), com a #99 do responsável, e **Finalizado: sim** (9 de 12). Depois: "Parcial" por 21 alertas sem correção nem decisão (#107) e 38 corrigidos só na sprint (PR #108); **Finalizado: não** (9 de 12).

### Tabela de 10/11/2026 (ciclo da faixa de 90%)

| # | Critério | Como verificar | Situação em 10/11/2026 (ciclo da faixa de 90%) |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: meta decidida pelo coordenador em 10/11/2026 (decisão D1), revisável pelo responsável; aposta na seção 5 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende (decisão D2): o e2e `filtra por gênero, abre o detalhe e volta com o filtro` roda no CI (job `e2e`); local, 10/11/2026: 12 testes, 0 falhas. No ar, 10/11/2026: `curl` no site deu HTTP 200 e a TMDB respondeu 200 (19 gêneros) à chave publicada, conferida sem imprimir. O teste com 5 pessoas virou validação de produto (#59) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: decisões registradas em 31/10 |
| 5 | Medição de uso | A métrica principal é coletada | Parcial: código pronto; falta a conta (decisão D5, #58). GoatCounter com o código `douglasabnovato`, sem cookie, só no site publicado; conta cada rota e o evento `abriu-filme`. Testes (Jest e e2e) conferem que não carrega em localhost nem nos testes e que, no endereço publicado, abrir um filme conta o evento |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: URL como fonte dos filtros e página além do total corrigidos; conferido no site em 01/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Parcial: o código que baixa o LCP ainda não está no ar (a `main` não recebeu a sprint; `git log main..developer/sprint-2026-11-12` com os PRs #88 e #92, 10/11/2026). Local, 09/11/2026: mediana de 2,38 s; no ar, 3,33 s em 06/11/2026 com o código antigo. Medir no site depois do merge (decisão D6, #57, #90). Detalhes na seção 7 |
| 8 | Acessibilidade básica | Lighthouse e teclado | Atende: Lighthouse 100, teclado no CI e verificação automática WCAG A e AA nas 3 telas do fluxo; leitor de tela não testado |
| 9 | Segurança e conformidade | Riscos decididos; termos da API cumpridos | Atende: chave mantida por decisão (ADR-006); atribuição publicada |
| 10 | Entrega confiável | Publicação só depois de CI verde | Atende: `gh api repos/douglasabnovato/movies/rules/branches/main`, 10/11/2026: `required_status_checks` com `build-and-test` e `e2e`, além de PR obrigatório e bloqueio de force push e exclusão; a publicação no Pages só sai do workflow, depois de testes e e2e (#73) |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: `npx react-scripts test --watchAll=false`, 10/11/2026: 74 testes, 0 falhas; `test:scripts` sem `skipped`; e2e com 12 testes no CI |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende com este documento, conferido contra o `package.json` em 10/11/2026 |

**Resultado:** 10 de 12; finalizado: sim.

### Tabela de 09/11/2026 (ciclo de 09/11/2026; critério 10 revisto em 10/11/2026)

| # | Critério | Como verificar | Situação em 10/11/2026, antes do ciclo da faixa de 90% |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: veja a seção 5 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: teste automático no CI; ninguém de fora testou (#59) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: decisões registradas em 31/10 |
| 5 | Medição de uso | A métrica principal é coletada | Não atende (#58) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: URL como fonte dos filtros e página além do total corrigidos; conferido no site em 01/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Parcial: local, 09/11/2026 (ciclo de 09/11), build de produção servido com gzip como no Pages, retrato renovado, Lighthouse 12.8.2 móvel, `timeout 150`: 2,77, 2,38, 2,40, 2,30 e 2,26 s (mediana 2,38 s; TBT de 112 a 292 ms); o elemento do LCP foi o pôster do esqueleto nas 5. No ar: 3,33 s (06/11/2026), com o código antigo. Só vira "Atende" com a medição no site, depois do merge na `main` pelo responsável (#57, #90). Detalhes na seção 7 |
| 8 | Acessibilidade básica | Lighthouse e teclado | Atende: Lighthouse 100, teclado no CI e verificação automática WCAG A e AA nas 3 telas do fluxo; leitor de tela não testado |
| 9 | Segurança e conformidade | Riscos decididos; termos da API cumpridos | Atende: chave mantida por decisão (ADR-006); atribuição publicada |
| 10 | Entrega confiável | Publicação só depois de CI verde | Atende (10/11/2026): `gh api repos/douglasabnovato/movies/rulesets`, ruleset `principal-protegida` ativo (exige PR, bloqueia force push e exclusão); o workflow `CI` roda nos PRs para `main` e `developer/**`, e a publicação no Pages só sai dele, depois de testes e e2e (#73) |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: Jest (3 testes novos da espera do esqueleto), `test:scripts` e e2e com Playwright (2 novos do retrato vencido) no CI do PR #92, 09/11/2026 |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende com este documento |

### Tabela de 09/11/2026 (ciclo de 07/11/2026)

| # | Critério | Como verificar | Situação em 09/11/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: veja a seção 5 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: teste automático no CI; ninguém de fora testou (#59) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: decisões registradas em 31/10 |
| 5 | Medição de uso | A métrica principal é coletada | Não atende (#58) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: URL como fonte dos filtros e página além do total corrigidos; conferido no site em 01/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não atende. No ar: 3,33 s (06/11/2026); muda depois do merge na `main`, que publica pelo CI. Local, 09/11/2026, build de produção com o retrato renovado: antes 3,93, 3,35 e 4,22 s (mediana 3,93 s); depois 3,02, 2,93 e 3,51 s (mediana 3,02 s). O LCP passou a ser o pôster do esqueleto; o que falta é o download do pôster na rede simulada (#57). Detalhes na seção 7 |
| 8 | Acessibilidade básica | Lighthouse e teclado | Atende: Lighthouse 100, teclado no CI e verificação automática WCAG A e AA nas 3 telas do fluxo; leitor de tela não testado |
| 9 | Segurança e conformidade | Riscos decididos; termos da API cumpridos | Atende: chave mantida por decisão (ADR-006); atribuição publicada |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial: publicação só pelo CI, depois de testes e e2e, mas a `main` segue sem proteção (#73). Pela decisão de 03/11/2026, sem proteção o critério fica parcial |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: Jest (com 10 testes novos da espera do esqueleto), `test:scripts` e e2e com Playwright no CI do PR #88, 09/11/2026 |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende com este documento |

**Resultado:** 8 de 12; finalizado: não (critério 7 sem medição abaixo de 2,5 s).

### Tabela de 06/11/2026 (ciclo de 03/11/2026)

| # | Critério | Como verificar | Situação em 06/11/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: veja a seção 5 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: teste automático no CI; ninguém de fora testou (#59) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: decisões registradas em 31/10 |
| 5 | Medição de uso | A métrica principal é coletada | Não atende (#58) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: URL como fonte dos filtros e página além do total corrigidos; conferido no site em 01/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não atende: mediana de 3,33 s no site publicado em 06/11/2026 (3,33, 3,68 e 3,28 s), já com o retrato da Home no HTML (#81). O pôster começa a baixar sem espera; o limite agora é o atraso de renderização, de 2,3 a 2,8 s (#57) |
| 8 | Acessibilidade básica | Lighthouse e teclado | Atende: Lighthouse 100, teclado no CI e verificação automática WCAG A e AA nas 3 telas do fluxo; leitor de tela não testado |
| 9 | Segurança e conformidade | Riscos decididos; termos da API cumpridos | Atende: chave mantida por decisão (ADR-006); atribuição publicada |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial: publicação só pelo CI, depois de testes e e2e, mas a `main` segue sem proteção (#73). Pela decisão de 03/11/2026, sem proteção o critério fica parcial |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende com este documento |

**Resultado em 06/11/2026:** 8 de 12 critérios atendidos, 2 parciais (3 e 10) e 2 não atendidos (5 e 7). Em 02/11 eram 9: o critério 10 passou a parcial pela regra de proteção da `main`, sem mudança no código. Faltam o teste com pessoas de fora (#59), a medição de uso (#58), a proteção da `main` (#73) e o LCP móvel (#57).
