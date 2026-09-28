# Análise do projeto — Movies (TMDB Explorer)

> Data da análise: 27/09/2026 · Branch analisada: `main` · Grupo: **front-end puro (SPA)**

## 1. Contexto de produto

| Item | Descrição |
|---|---|
| Problema | Descobrir filmes (populares, por gênero ou por nome) e decidir o que assistir sem abrir vários sites. |
| Público | Pessoa que quer escolher um filme em poucos minutos, no celular ou no desktop. |
| Proposta de valor | Catálogo da TMDB em português, com busca instantânea, filtros combináveis e uma página de detalhes com elenco, trailer e recomendações. |
| Origem | Desafio técnico front-end da Promobit, evoluído como estudo de caso de produto, DevOps e engenharia front-end. |
| Métrica norte (proposta) | Taxa de "chegada ao detalhe": sessões que abrem ao menos um filme ÷ sessões totais. |

## 2. Especificação de requisitos

### 2.1 Requisitos funcionais

| ID | Requisito | Situação encontrada |
|---|---|---|
| RF01 | Listar os filmes populares do dia (`GET /movie/popular`). | Atende |
| RF02 | Abrir a página de detalhes em rota própria (`/movie/:id`). | Atende |
| RF03 | Paginar a listagem (limite de 500 páginas da API). | Atende |
| RF04 | Buscar por nome com debounce de 500 ms. | Atende, com condição de corrida (ver D3) |
| RF05 | Filtrar por um ou vários gêneros (`/discover/movie`) e remover filtros individualmente. | Atende |
| RF06 | Manter busca, filtros e página na URL ao voltar do detalhe. | Atende |
| RF07 | Exibir elenco, equipe técnica, trailer e recomendações no detalhe. | Atende, com 4 requisições por página |
| RF08 | Informar a pessoa quando algo der errado e permitir tentar de novo. | **Não atende** (ver D2) |

### 2.2 Requisitos não funcionais (ISO/IEC 25010)

| ID | Característica | Requisito | Situação |
|---|---|---|---|
| RNF01 | Segurança — confidencialidade | Nenhuma credencial no código-fonte nem em arquivo versionado. | **Não atende** (D1) |
| RNF02 | Confiabilidade — tolerância a falhas | Falha de rede não pode ser apresentada como "nenhum resultado". | **Não atende** (D2) |
| RNF03 | Eficiência — comportamento temporal | Voltar a uma página já vista não deve refazer a requisição. | Não atende (sem cache) |
| RNF04 | Usabilidade — acessibilidade | WCAG 2.2 AA nos controles interativos. | Parcial (D5) |
| RNF05 | Compatibilidade | Últimas versões de Chrome, Firefox e Edge; layout responsivo. | Atende |
| RNF06 | Manutenibilidade — testabilidade | Regras da camada de serviço e estados de tela cobertos por testes. | Parcial (só utilitários) |

### 2.3 Regras de negócio

- RN01 — A busca por nome tem precedência sobre o filtro de gêneros; ao digitar, os gêneros são limpos (e vice-versa).
- RN02 — A página máxima é 500, limite imposto pela TMDB.
- RN03 — Conteúdo em `pt-BR`; datas em `DD/MM/AAAA`; duração em `Xh Ym`.

## 3. Diagnóstico (defeitos encontrados)

| ID | Severidade | Onde | Defeito | Referência |
|---|---|---|---|---|
| D1 | **Crítica** | `src/services/tmdbApi.js` e `src/.env` | Chave da TMDB escrita como valor padrão no código e arquivo `src/.env` versionado no Git (o `.gitignore` só vale para arquivos ainda não rastreados). | OWASP Top 10 A05 (Security Misconfiguration) e ASVS V2.10 / V14 |
| D2 | Alta | `pages/Home`, `pages/Details` | O `catch` só faz `console.error`: falha de rede aparece como "Nenhum filme encontrado" ou "Filme não encontrado", sem opção de tentar de novo. | Heurísticas de Nielsen nº 1 (visibilidade do estado) e nº 9 (recuperação de erros) |
| D3 | Alta | `pages/Home` | Condição de corrida: respostas fora de ordem (buscar "ma" e depois "matrix") podem sobrescrever o resultado mais recente. Não há cancelamento. | Concorrência: *last-write-wins* sem controle de versão; `AbortController` |
| D4 | Média | Todas as imagens | Fallback aponta para `via.placeholder.com`, serviço desativado: cada filme sem pôster gera uma requisição quebrada. | Confiabilidade de dependência externa |
| D5 | Média | `Pagination`, `Details` | Página atual sem `aria-current`, botões de navegação só com `title`, botão flutuante de voltar sem nome acessível. | WCAG 2.2 — 4.1.2 (Nome, Função, Valor) e 2.4.4 |
| D6 | Média | `pages/Home` | `new Date("2024-05-01")` é interpretado em UTC e exibido em UTC-3: a data aparece um dia antes. | Tratamento de fuso horário (ISO 8601) |
| D7 | Média | `pages/Details` | 4 requisições por detalhe (`Promise.all`), quando a TMDB aceita `append_to_response` em uma única chamada. | Redução de *round-trips* (latência ≈ RTT × nº de requisições em redes móveis) |
| D8 | Baixa | `hooks/useFetch.js` | Hook testado, mas não usado por nenhuma tela (código morto). | Clean Code — YAGNI |
| D9 | Baixa | `Readme.md` | Issues #04 e #12 marcadas como feitas sem estarem; imagem `mobile-tmdb.jpg` citada não existe. | Documentação como contrato |

## 4. Critérios de MVP e nota atual

### 4.1 Rubrica (0 a 10 por critério)

Pesos do grupo **front-end puro**. Aprovação: média ponderada ≥ 7,0 **e** nenhum critério eliminatório (C1 e C4) abaixo de 5.

| # | Critério | Referência | Peso | Nota atual | Justificativa |
|---|---|---|---|---|---|
| C1 | Núcleo de valor | MVP (Eric Ries) | 20% | 8 | Listar, buscar, filtrar, paginar e detalhar funcionam. |
| C2 | Estados de erro, vazio, carregando e sucesso | Nielsen | 12% | 4 | Carregando e vazio existem; erro é engolido (D2). |
| C3 | Acessibilidade | WCAG 2.2 AA | 12% | 6 | HTML semântico e rótulos; falhas em D5. |
| C4 | Segurança | OWASP Top 10 / ASVS L1 | 12% | 3 | Credencial no código e no Git (D1). |
| C5 | Dados | Normalização / fonte única de verdade | 4% | 7 | URL como fonte de estado dos filtros; sem persistência local. |
| C6 | Testes | Pirâmide de testes (Cohn) | 10% | 4 | 6 testes, só em utilitários e num hook sem uso. |
| C7 | Qualidade de código | SOLID / Clean Architecture | 10% | 6 | Camada de serviço boa; corrida (D3), código morto (D8), duplicação de placeholders. |
| C8 | Desempenho | Core Web Vitals / complexidade | 8% | 5 | Sem cache, 4 chamadas por detalhe, imagens sem `loading="lazy"` nem dimensões (CLS). |
| C9 | Operação | 12-Factor (III Config) / CI | 6% | 7 | CI com testes e build; deploy no GitHub Pages; chave via *secret* no CI. |
| C10 | Documentação | README como contrato | 6% | 6 | README extenso, porém com status incorretos (D9). |

**Nota atual: 5,62 / 10 — REPROVADO** (média abaixo de 7,0 e C4 eliminatório com nota 3).

### 4.2 Critérios de aceite do MVP (BDD)

```gherkin
Funcionalidade: Descobrir filmes

  Cenário: Falha de rede na listagem
    Dado que a API da TMDB está indisponível
    Quando eu abro a página inicial
    Então vejo a mensagem "Não foi possível carregar os filmes"
    E vejo o botão "Tentar novamente"

  Cenário: Busca digitada rapidamente
    Dado que digitei "ma" e depois "matrix"
    Quando a resposta de "ma" chegar depois da resposta de "matrix"
    Então a lista continua mostrando os resultados de "matrix"

  Cenário: Filme inexistente
    Dado que acesso "/movie/0"
    Então vejo "Filme não encontrado" e um link para voltar à lista

  Cenário: Chave não configurada
    Dado que a variável REACT_APP_TMDB_KEY não foi definida
    Quando eu abro a aplicação
    Então vejo uma mensagem explicando como configurar a chave
    E nenhuma chave está escrita no código-fonte
```

## 5. Nota depois do ciclo de melhorias (27/09/2026)

| # | Critério | Antes | Depois | O que mudou |
|---|---|---|---|---|
| C1 | Núcleo de valor | 8 | 9 | Data correta na listagem; título da aba por página. |
| C2 | Estados | 4 | 9 | `ErrorState` com "Tentar novamente"; 404 separado de falha de rede; erro de configuração explicado. |
| C3 | Acessibilidade | 6 | 8 | `aria-current`, rótulos na paginação e no botão de voltar, títulos `h2` nas seções; axe-core: 0 violações WCAG 2.2 AA na Home, no Detalhe e no estado de erro. |
| C4 | Segurança | 3 | 6 | Chave removida do código e da URL de cache; `.env.example`. Sobe para 8 quando `src/.env` sair do Git e a chave antiga for revogada. |
| C5 | Dados | 7 | 8 | Chave de cache normalizada (parâmetros ordenados, sem credencial). |
| C6 | Testes | 4 | 8 | 32 testes em 7 suítes: cache, serviço, hook, paginação, Home e Detalhe. |
| C7 | Qualidade de código | 6 | 8 | Condição de corrida eliminada; `useFetch` passou a ser usado; placeholders centralizados. |
| C8 | Desempenho | 5 | 7 | Cache TTL, 1 requisição no detalhe (antes 4), `loading="lazy"`, dimensões fixas (CLS) e pôster `w342` na grade. |
| C9 | Operação | 7 | 7 | CI inalterado (pasta `.github` não foi alterada). |
| C10 | Documentação | 6 | 9 | `docs/` completo; README com "Como executar" e status corrigidos. |

**Nota depois: 8,00 / 10 — APROVADO** (C1 = 9 e C4 = 6, ambos acima do mínimo eliminatório 5).

Verificação: `npm test` (32/32), `npm run build` com `CI=true` sem avisos e busca por chave no `src/` e no `build/` sem ocorrências.
