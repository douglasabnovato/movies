# MVP — critérios e tarefas

> Criado em 30/10/2026 e revisto em 31/10/2026. Complementa a rubrica técnica de `docs/ANALISE.md`, medindo também se o produto consegue aprender com o uso real.

## 1. Critérios

| # | Critério | Como verificar | Situação em 30/10/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: veja a seção 5 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: teste automático no #53; ninguém de fora testou |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: decisões registradas em 31/10 |
| 5 | Medição de uso | A métrica principal é coletada | Não atende |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Parcial: 2 defeitos com correção em PR |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Parcial: acima da meta; correção em PR |
| 8 | Acessibilidade básica | Lighthouse e teclado | Parcial: Lighthouse 100; teclado coberto no #53, sem leitor de tela |
| 9 | Segurança e conformidade | Riscos decididos; termos da API cumpridos | Parcial: chave mantida (ADR-006); atribuição em PR |
| 10 | Entrega confiável | Publicação só depois de CI verde | Atende, mas a `main` segue sem proteção |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende com este documento |

## 2. Tarefas obrigatórias

| # | Tarefa | Situação |
|---|---|---|
| 1 | Fazer da URL a fonte única dos filtros | PR aberto |
| 2 | Tratar página além do total | PR aberto |
| 3 | Proteger a `main` e exigir CI verde | Com o responsável |
| 4 | Adicionar a atribuição exigida pela TMDB e trocar a marca principal | PR aberto |
| 5 | Reduzir o LCP no celular para até 2,5 s | PR aberto; medir depois da publicação |
| 6 | Definir a hipótese e medir a chegada ao detalhe | Hipótese e meta definidas; a medição automática depende de escolher a ferramenta |
| 7 | Corrigir README e planos | PR aberto |
| 8 | Decidir as issues #14, #18, #37 e #44 | Decidido: #14, #18 e #37 fechadas; #44 no PR #54 |
| 9 | Testar com 5 pessoas e registrar o aprendizado | Com o responsável |

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
