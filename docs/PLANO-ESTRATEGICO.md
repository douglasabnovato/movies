# Plano estratégico de desenvolvimento — Movies

> Criado em 30/10/2026. Diagnóstico em `docs/AVALIACAO.md`. Histórico anterior em `docs/PLANO-DE-ACAO.md`.

## 1. Objetivo

Transformar o `movies` em uma vitrine de engenharia front-end: um projeto pequeno, confiável e fácil de evoluir, em que quem avalia consiga ver as decisões técnicas e o motivo de cada uma.

## 2. Princípios

1. **Corrigir antes de migrar:** robustez e pipeline vêm antes de trocar a ferramenta de build.
2. **Uma mudança de risco por vez:** a migração para Vite não vai junto com a primeira publicação da versão nova.
3. **Decisão registrada:** escolhas de arquitetura viram ADR em `docs/ARQUITETURA.md`.
4. **Só o necessário:** nada de biblioteca nova sem um problema concreto.

## 3. Ciclos

| Ciclo | Tema | Entrega | Dívidas e defeitos | Situação |
|---|---|---|---|---|
| 1 | Robustez e pipeline | Rota 404, Error Boundary, validação de entrada, erros tipados, CI separado, dependências limpas | E1 a E12 | Implementado na branch `refactor/robustez-e-pipeline`; falta publicar |
| 2 | Publicação validada | Merge, teste com a API real, Lighthouse, fechamento das issues | Verificação pendente | Depende do merge |
| 3 | Plataforma | CRA → Vite e Vitest, mantendo `REACT_APP_` no início | A1 | Próximo ciclo técnico |
| 4 | Contratos e estilos | TypeScript no serviço, hook de filtros, CSS Modules | A4, A5, A6 | Depois do ciclo 3 |
| 5 | Confiança de ponta a ponta | Playwright nos fluxos principais, usando respostas simuladas | Sem E2E | Depois do ciclo 3 |
| 6 | Produto | Avaliar favoritos e SEO; rotas limpas só com outra hospedagem | A2 | Decisão de produto |

## 4. Metas

| Critério | Antes | Meta do ciclo 1 | Meta final |
|---|---|---|---|
| Separação de responsabilidades | 8 | 8 | 9 |
| Confiabilidade | 6 | 8 | 9 |
| Segurança | 4 | 5 | 5, enquanto a chave não for trocada |
| Testes | 7 | 8 | 9 |
| Pipeline | 5 | 8 | 9 |
| Dependências | 3 | 4 | 8 |
| Manutenibilidade | 6 | 7 | 8 |
| Documentação | 7 | 8 | 9 |

## 5. Definição de pronto

- `npm run lint`, `npm run test:ci` e `npm run build` passam localmente e no CI.
- Todo defeito corrigido tem um teste que falharia sem a correção.
- A documentação acompanha a mudança.
- A publicação só acontece com aprovação do responsável.

## 6. Resultado do ciclo 1 (30/10/2026)

| Critério | Antes | Depois | O que mudou |
|---|---|---|---|
| Separação de responsabilidades | 8 | 8 | Sem mudança estrutural |
| Confiabilidade | 6 | 8 | Rota 404, Error Boundary, página validada, erros 401 e de JSON tratados |
| Segurança | 4 | 5 | Permissões mínimas no CI, secret só no deploy, `id` codificado; chave mantida |
| Testes | 7 | 8 | De 34 para 47 testes, com cobertura mínima no CI |
| Pipeline | 5 | 8 | Lint, build estrito e deploy separado, só pela `main` |
| Dependências | 3 | 4 | 4 pacotes sem uso removidos; o total de alertas não mudou |
| Manutenibilidade | 6 | 7 | Menos dependências, marco `<main>` e nome de pacote válido |
| Documentação | 7 | 8 | Arquitetura reflete o código; ADRs 006 e 007 |

**Média: de 5,8 para 7,0.**

**Verificado:** instalação limpa com `npm ci`, lint, 47 testes em 3 execuções, build estrito com e sem chave. No navegador, com chave falsa: rota desconhecida, `page=-1` e HTTP 401 real da TMDB na Home e no Detalhe.

**Verificado no ar (30/10/2026, versão do PR #45, API real):** listagem, filtro por gênero com página na URL, busca, detalhe em 1 requisição, volta com filtros e filme inexistente.

**Ainda não verificado:** as mudanças deste ciclo no site publicado e o job `deploy` novo, que só rodam depois do merge na `main`; Lighthouse.

**Limite do resultado:** `npm audit` continua com 48 alertas no total, quase todos do `react-scripts` e só resolvidos com a migração. Entre as dependências de produção restam 2 alertas moderados do React Router 6, corrigidos apenas na versão 7. Eles tratam de `<Link>` com destino controlado por terceiros e de hidratação SSR; o app não usa SSR, e o destino dos links vem do próprio app.

## 7. Próximos passos

1. Fazer o merge desta branch e acompanhar o job `deploy`. O GitHub Pages pode levar cerca de 1 minuto para servir a versão nova depois do job verde.
2. Testar de novo o site publicado e rodar o Lighthouse.
3. Fechar as issues com evidência e alinhar o Project #1.
4. Migrar para Vite e Vitest (ciclo 3), incluindo o React Router 7.
5. Adicionar TypeScript no serviço, hook de filtros e CSS Modules (ciclo 4).
6. Cobrir os fluxos principais com Playwright (ciclo 5).

## 8. O que você pode melhorar no projeto

**Arquitetura**

- Tirar a lógica de filtros da Home para um hook `useMovieFilters`, com a URL como única fonte de verdade.
- Criar um mapeador entre a resposta da TMDB e o modelo da tela, para que uma mudança na API afete um só arquivo.
- Se o projeto ganhar público, colocar um proxy serverless na frente da TMDB. É a única forma de tirar a chave do navegador.
- Se SEO virar prioridade, trocar o GitHub Pages por uma hospedagem que permita rotas limpas.

**Engenharia**

- Proteger a `main`: exigir PR e CI verde. Hoje nada impede um push direto, que publica o site.
- Simplificar o fluxo de branches: a `developer-mvp` está atrás da `main`. Trabalhar só com a `main` e branches curtas evita esse desvio.
- Ativar o Dependabot, com agrupamento, depois da migração.
- Atualizar o Node e as actions: o GitHub já avisa que o Node 20 está obsoleto nos runners.
- Adicionar medição de erros e de uso. Hoje uma falha em produção não avisa ninguém, e a métrica norte de `docs/ANALISE.md` não é medida.

**Produto e apresentação**

- Colocar no início do README o problema, o link, uma captura de tela e as três decisões técnicas mais interessantes.
- Decidir o que fazer com as issues #14 (Figma), #18 e #37 (tema 007) e #44 (animação do botão).
- Rever a decisão sobre a chave antes de divulgar o projeto: trocá-la leva poucos minutos e não exige mudança de código.
