# MVP — critérios e tarefas

> Criado em 30/10/2026. Complementa a rubrica técnica de `docs/ANALISE.md`, medindo também se o produto consegue aprender com o uso real.

## 1. Critérios

| # | Critério | Como verificar | Situação em 30/10/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial: há métrica, sem meta |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: ninguém de fora testou |
| 4 | Escopo enxuto | O que não entra está registrado | Parcial: 4 decisões abertas |
| 5 | Medição de uso | A métrica principal é coletada | Não atende |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Parcial: 2 defeitos com correção em PR |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Parcial: acima da meta; correção em PR |
| 8 | Acessibilidade básica | Lighthouse e teclado | Parcial: Lighthouse 100; teclado não testado neste ciclo |
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
| 6 | Definir a hipótese e medir a chegada ao detalhe | Falta escolher a ferramenta e a meta |
| 7 | Corrigir README e planos | PR aberto |
| 8 | Decidir as issues #14, #18, #37 e #44 | Com o responsável |
| 9 | Testar com 5 pessoas e registrar o aprendizado | Com o responsável |

## 3. Tarefas recomendadas

- Confirmar a largura de 768 px em um aparelho real.
- Testar a navegação por teclado.
- Adicionar Prettier e retirar o Axios da #23.
- Atualizar o Node nos runners e apagar as branches já mergeadas.
- Criar um teste Playwright do fluxo principal.

## 4. Fora do MVP

Tema 007, animação do botão, pixel perfect, SEO com outra hospedagem, proxy da chave, Vite, TypeScript e CSS Modules. As quatro primeiras dependem da decisão do responsável; a ordem técnica está em `docs/PLANO-ESTRATEGICO.md`.
