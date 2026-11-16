# ADR-008 — Manter o react-router 6 até a migração para a 7

- **Situação:** aceita em 16/11/2026, até a #100 ser concluída.
- **Numeração:** continua a série ADR-001 a ADR-007 de [`ARQUITETURA.md`](../ARQUITETURA.md), seção 5.

## Contexto

`npm audit --omit=dev` (16/11/2026) aponta 2 alertas moderados no `react-router` 6.0.0 a 7.17.0, que o `react-router-dom` 6.30.6 do projeto usa:

- [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6): redirecionamento aberto quando um caminho com barra invertida chega a `<Link>` ou `useNavigate`.
- [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg): injeção de construtor na hidratação de erros do SSR.

`npm view react-router-dom@6 version` (16/11/2026): a última versão da linha 6 é a 6.30.6, a que já usamos. Não há patch nem versão menor que corrija. A correção está na 7.18.5, troca de versão maior com mudanças descritas no [guia oficial de atualização da v6](https://reactrouter.com/upgrading/v6).

## Quem é afetado

- **SSR:** ninguém. O app é uma SPA do Create React App com `HashRouter`, publicada como arquivos estáticos. Não há hidratação de servidor.
- **Redirecionamento aberto:** risco baixo. Todo `to` de `<Link>` é montado pelo próprio app: `/movie/<id numérico da TMDB>` e `/` mais a busca da lista, que vem de `URLSearchParams.toString()` (barra invertida sai codificada como `%5C`). O app não usa `useNavigate` com texto vindo da URL nem de quem visita.

## Decisão

Manter o `react-router-dom` 6.30.6 e aceitar os 2 alertas até a migração para a 7, que segue na #100.

## Consequências

- O `npm audit --omit=dev` continua com 2 alertas moderados; quem rodar o comando acha esta ADR pelo critério 9 do [`MVP.md`](../MVP.md).
- Um `<Link>` ou `navigate()` novo que use texto da URL ou de quem visita precisa de revisão antes do merge, ou a migração passa a ser urgente.

## Como desfazer

Concluir a #100: atualizar para o `react-router-dom` 7.18.5 ou superior, rever o `HashRouter` e as `future flags`, rodar Jest, `test:scripts`, e2e e build, e conferir `npm audit --omit=dev` sem alertas do `react-router`. Depois, marcar esta ADR como substituída.
