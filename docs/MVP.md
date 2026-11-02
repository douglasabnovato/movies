# MVP — critérios e tarefas

> Criado em 30/10/2026 e revisto em 02/11/2026. Complementa a rubrica técnica de `docs/ANALISE.md`, medindo também se o produto consegue aprender com o uso real.

## 1. Critérios

| # | Critério | Como verificar | Situação em 02/11/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: veja a seção 5 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: teste automático no CI; ninguém de fora testou (#59) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: decisões registradas em 31/10 |
| 5 | Medição de uso | A métrica principal é coletada | Não atende (#58) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: URL como fonte dos filtros e página além do total corrigidos; conferido no site em 01/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não atende: mediana de 3,29 s no site publicado em 02/11/2026 (2,95, 3,29, 2,35, 3,36 e 4,19 s). A primeira pintura caiu para 0,9 s; o limite agora é o pôster, que depende da chamada à API. |
| 8 | Acessibilidade básica | Lighthouse e teclado | Atende: Lighthouse 100, teclado no CI e verificação automática WCAG A e AA nas 3 telas do fluxo; leitor de tela não testado |
| 9 | Segurança e conformidade | Riscos decididos; termos da API cumpridos | Atende: chave mantida por decisão (ADR-006); atribuição publicada |
| 10 | Entrega confiável | Publicação só depois de CI verde | Atende, mas a `main` segue sem proteção (#73) |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende com este documento |

**Resultado em 02/11/2026:** 9 de 12 critérios atendidos. Faltam o teste com pessoas de fora (#59), a medição de uso (#58) e o LCP móvel (#57). Os dois primeiros dependem do responsável; o terceiro, de mudar a arquitetura, o que só vale depois de medir em celular real.

## 2. Tarefas obrigatórias

| # | Tarefa | Situação |
|---|---|---|
| 1 | Fazer da URL a fonte única dos filtros | Feito |
| 2 | Tratar página além do total | Feito |
| 3 | Proteger a `main` e exigir CI verde | Com o responsável (#73) |
| 4 | Adicionar a atribuição exigida pela TMDB e trocar a marca principal | Feito |
| 5 | Reduzir o LCP no celular para até 2,5 s | Em andamento: veja a seção 7 e a #57 |
| 6 | Definir a hipótese e medir a chegada ao detalhe | Hipótese e meta definidas; a medição automática depende de escolher a ferramenta |
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

**Hipótese:** quem chega ao site quer descobrir um filme, e buscar ou filtrar por gênero basta para encontrar um que valha abrir.

**Métrica:** chegada ao detalhe, ou seja, sessões que abrem ao menos um filme ÷ sessões totais (`docs/ANALISE.md`).

| Teste | Meta | Se não atingir |
|---|---|---|
| 5 pessoas, sem ajuda: "encontre um filme para ver hoje e abra a ficha" | Ao menos 4 concluem em até 2 minutos | Rever a busca e o filtro antes de qualquer função nova |
| Uso real, depois de escolher a ferramenta | Ao menos 50% das sessões, com no mínimo 100 sessões | Olhar onde as pessoas param |

As metas são um ponto de partida escolhido por julgamento, sem dados anteriores, e devem ser revistas depois da primeira medição.

**Ferramenta:** nenhuma foi adotada, porque exige criar conta e decidir sobre privacidade. Enquanto isso, o teste com 5 pessoas é a fonte de evidência, e o critério 5 continua sem atender.

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

A meta de 2,5 s não foi atingida. Com o esqueleto no HTML, o CLS caiu de 0,10 a 0,13 para 0. O Lighthouse simula a rede lenta: o LCP observado sem essa simulação foi de 1,2 s na primeira execução final, mas o simulado é o que vale para a meta. O pôster depende de uma chamada à API feita por JavaScript, e esse é o limite restante; a #57 segue a partir daí.

## 8. Verificação de acessibilidade

Em 02/11/2026, o axe-core entrou no Playwright (`e2e/tests/acessibilidade.spec.js`), cobrindo página inicial, lista filtrada e detalhe. Ele achou um defeito real: o gênero selecionado tinha texto branco sobre laranja, com contraste insuficiente. O texto passou a ser escuro. A ferramenta não substitui o teste com leitor de tela.

## 9. Melhoria do processo

Medir o gargalo antes de corrigir: a fase de cada métrica mostra o limite do ganho. Aqui, adiantar a imagem reduziu a espera, mas o FCP continuou como piso.
