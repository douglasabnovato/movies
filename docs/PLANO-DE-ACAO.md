# Plano de ação — Movies (TMDB Explorer)

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
| T13 | Must (usuário) | Tirar `src/.env` do Git e revogar a chave antiga na TMDB | D1 | C4 | Alto | 1 | ⏳ Com você |
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
