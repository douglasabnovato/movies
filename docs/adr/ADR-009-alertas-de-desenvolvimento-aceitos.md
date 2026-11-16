# ADR-009 — Aceitar os alertas de desenvolvimento do Dependabot

- **Situação:** Aceita.
- **Data:** 16/11/2026.
- **Ordem do responsável repassada pelo DG líder em 16/11/2026:** "Regra geral por ADR. alertas que nao atrapalham a producao, pode passar. os que atrapalham, entender, escolher a melhor estrategia para manter a funcionalidade"
- **Numeração:** continua a série de [`ARQUITETURA.md`](../ARQUITETURA.md), seção 5, e a [ADR-008](ADR-008-react-router-6-risco-aceito.md).

## Contexto

`gh api "repos/douglasabnovato/movies/dependabot/alerts?state=open&per_page=100"`, 16/11/2026, 14:39: 61 alertas abertos.

- 38 já estão corrigidos na `developer/sprint-2026-11-19` (PR #108) e fecham com o merge na `main`.
- 2 são do `react-router` 6.30.6, o único pacote de runtime com alerta. Já têm decisão na [ADR-008](ADR-008-react-router-6-risco-aceito.md), até a migração da #100. Esta ADR não os repete.
- 21 seguem abertos no `package-lock.json`, todos puxados pelo `react-scripts` 5.0.1, que está em `devDependencies`. A correção de cada um só existe numa versão maior que o `react-scripts` não aceita (detalhes na #107).

Prova de que esses 21 não chegam ao site, 16/11/2026:

- `npm ls @tootallnate/once svgo serialize-javascript webpack-dev-server deepmerge webpack-dev-middleware postcss uuid --omit=dev`: `(empty)`.
- No `package-lock.json`, toda versão vulnerável desses pacotes tem `"dev": true`.
- `npm audit --omit=dev`: só os 2 moderados do `react-router` (ADR-008).

O site é o resultado do `npm run build`: arquivos estáticos no GitHub Pages. O servidor de desenvolvimento, o Jest e as ferramentas de build rodam só na máquina de quem programa e no CI.

## Alertas aceitos

| Alerta | Pacote (versão) | Severidade | Quem o puxa | Por que não chega à produção |
|---|---|---|---|---|
| #10 | `@tootallnate/once` 1.1.2 | baixa | `react-scripts` → `jest` 27 → `jsdom` 16 → `http-proxy-agent` 4 | Só roda nos testes do Jest |
| #55 | `deepmerge` 4.3.1 | baixa | `react-scripts` → `@svgr/webpack`, `jest-config`, `fork-ts-checker-webpack-plugin`, `workbox-build` | Ferramentas de build e teste; sem versão corrigida publicada |
| #3, #8, #17, #20, #21 | `postcss` 7.0.39 | 2 altas, 3 médias | `react-scripts` → `resolve-url-loader` 4 | Processa o CSS no build; o site recebe só o CSS gerado |
| #6, #12, #51 | `serialize-javascript` 4.0.0 e 6.0.2 | 1 alta, 1 média, 1 baixa | `react-scripts` → `rollup-plugin-terser` (Workbox) e `css-minimizer-webpack-plugin` 3 | Minificação no build |
| #16, #24, #25 | `svgo` 1.3.2 | 2 altas, 1 média | `react-scripts` → `@svgr/webpack` 5 → `@svgr/plugin-svgo` | Otimiza SVG no build |
| #11 | `uuid` 8.3.2 | média | `react-scripts` → `webpack-dev-server` 4 → `sockjs` | Só no `npm start` local |
| #28 | `webpack-dev-middleware` 5.3.4 | alta | `react-scripts` → `webpack-dev-server` 4 | Só no `npm start` local |
| #4, #5, #9, #13, #14, #15 | `webpack-dev-server` 4.15.2 | 6 médias | `react-scripts` 5.0.1 | Só no `npm start` local |

## Decisão

Aceitar os 21 alertas acima. Eles não atrapalham a produção: nenhum vai para o build publicado. Não há dispensa de alerta pela API; os alertas seguem abertos no GitHub, e esta ADR registra o motivo.

## Consequências

- O risco fica no ambiente de quem desenvolve e no CI, não no site. Quem roda `npm start` numa rede aberta expõe o servidor de desenvolvimento; rode em `localhost`.
- O Dependabot continua mostrando os 21 alertas até a troca do Create React App.
- O critério 9 do [`MVP.md`](../MVP.md) conta estes alertas como decididos.

## Quando revisar

- Se algum desses pacotes passar a ir para o bundle (aparecer em `npm ls --omit=dev`).
- Se surgir correção sem versão maior dentro do `react-scripts` 5.
- Na migração do Create React App para o Vite, que resolve os 21 de uma vez.
- Se aparecer alerta novo em pacote de runtime: esse não entra aqui e vai para correção.
