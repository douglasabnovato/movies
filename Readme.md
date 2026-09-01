<h1 align="center">
  🎬 Movies App — TMDB Explorer
</h1>

<p align="center">
  <b>Aplicação Web para exploração e consulta do catálogo de filmes da API The Movie Database (TMDB).</b>
</p>

<p align="center" style="display: flex; align-items: center; justify-content: center; gap: 10px;">
  <img alt="TMDB Preview Desktop 1" src="./.github/api-tmdb-1.jpg" width="400px">
  <img alt="TMDB Preview Desktop 3" src="./.github/api-tmdb-3.jpg" width="400px">
</p>

---

## 📌 Sumário
- [Sobre o Projeto](#-sobre-o-projeto)
- [Estrutura de Branches & Git Workflow](#-estrutura-de-branches--git-workflow)
- [Especificação de Requisitos & Desafio](#-especificação-de-requisitos--desafio)
  - [Requisitos da Aplicação](#requisitos-da-aplicação)
  - [Requisitos Funcionais](#requisitos-funcionais)
  - [Requisitos Não-Funcionais](#requisitos-não-funcionais)
  - [Requisitos Extras (Filtros & Navegação)](#requisitos-extras-filtros--navegação)
- [Critérios de Avaliação & Boas Práticas](#-critérios-de-avaliação--boas-práticas)
- [Histórico de Tarefas & Entregas Iniciais](#-histórico-de-tarefas--entregas-iniciais)
- [Métricas de Performance & Produtividade](#-métricas-de-performance--produtividade)
- [Layout da Aplicação](#-layout-da-aplicação)
- [🗺️ Plano Mestre de Evolução (70 Issues)](#️-plano-mestre-de-evolução-70-issues)
- [💡 Referências & Links Úteis](#-referências--links-úteis)
- [👨‍💻 Autor](#-autor)

---

## 💻 Sobre o Projeto

O **Movies App** é uma plataforma frontend moderna desenvolvida em **React**, cujo objetivo principal é consumir a API pública do [The Movie Database (TMDB v3)](https://developers.themoviedb.org/3/getting-started/introduction) para apresentar listagens de filmes populares, detalhar informações técnicas, elenco, trailers oficiais e permitir navegação fluida com filtros dinâmicos por gêneros.

O projeto foi originalmente concebido como um desafio técnico da **Promobit**, evoluindo para um estudo de caso prático de **Product Management (PM)**, **DevOps** e **Engenharia Frontend**.

## 🚀 Instruções de Execução Local

### Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina o [Node.js](https://nodejs.org/) (versão 16 ou superior) e o gerenciador de pacotes [Git](https://git-scm.com/).

### Passo a Passo

```bash
# 1. Clone este repositório
$ git clone [https://github.com/douglasabnovato/movies.git](https://github.com/douglasabnovato/movies.git)

# 2. Acesse a pasta do projeto
$ cd movies

# 3. Instale as dependências
$ npm install

# 4. Configure as variáveis de ambiente
# Crie um arquivo .env na raiz do projeto e adicione sua chave TMDB:
REACT_APP_TMDB_KEY=sua_chave_aqui_tmdb

# 5. Inicie o servidor de desenvolvimento
$ npm start
```

---

## 🌿 Estrutura de Branches & Git Workflow

Para manter o versionamento organized e seguro, adotamos o seguinte fluxo de trabalho no Git:

- **`main`**: Branch de código estável em produção.
- **`developer` / `developer-mvp`**: Branch de consolidação do ambiente de desenvolvimento.
- **`feature/*`**: Branches de desenvolvimento de funcionalidades específicas e tarefas (ex: `feature/tarefas`).
- **`v-dev-promobit`**: Histórico da primeira versão do desafio (MVP estático).
- **`v-dev-rocketflix`**: Histórico da segunda iteração de design/features.

---

## 📋 Especificação de Requisitos & Desafio

### Requisitos da Aplicação
- [x] Usar a API gratuita do [TMDB v3](https://developers.themoviedb.org/3/getting-started/introduction) para criar a listagem dos filmes populares do dia via endpoint `GET /movie/popular`.
- [x] Exibir uma página de detalhes ao clicar em qualquer filme da listagem usando o endpoint `GET /movie/{movie_id}`.
- [x] Seguir a composição visual, cores e fontes definidas no [Layout do Figma](https://www.figma.com/file/rM7WPqhLY9ObnGzSCeWLxB/Teste-Front-End).
- [x] Garantir a navegação entre páginas através de um componente funcional de **paginação**.

### Requisitos Funcionais
- [x] O usuário deve ter acesso à listagem dos filmes mais populares do dia.
- [x] O usuário deve ter acesso à página de detalhes ao selecionar um item da lista.
- [x] O usuário deve conseguir paginar a lista para descobrir novos títulos.
- [x] A página com detalhes de um filme deve possuir rota própria (`/movie/:id`) e estar preparada para indexação (SEO).

### Requisitos Não-Funcionais
- [x] Desenvolvido utilizando a biblioteca **React.js**.
- [x] Arquivo `README.md` completo na raiz do repositório com instruções de execução local e decisões de arquitetura.
- [x] Compatibilidade garantida na última versão estável dos navegadores: Chrome, Firefox e Edge.
- [x] Layout totalmente responsivo para desktop, tablet e dispositivos móveis.

### Requisitos Extras (Filtros & Navegação)
- [x] Consultar a lista oficial de gêneros através do endpoint `GET /genre/movie/list`.
- [x] Permitir que o usuário filtre os filmes listados selecionando **um ou múltiplos gêneros** simultaneamente (`GET /discover/movie`).
- [x] Permitir a remoção individual de filtros de gênero atualizando a listagem em tempo real.
- [x] Manter os filtros ativos ao retornar da tela de detalhes para a listagem principal.

---

## 🛠️ Critérios de Avaliação & Boas Práticas

- **Boas Práticas de Desenvolvimento:**
  - [x] HTML5 Semântico e acessibilidade básica (WCAG).
  - [x] Componentização modular (`pages`, `components`, `services`).
  - [x] Clean Code e padrões de projeto (Design Patterns).
- **Domínio de Ferramentas Modernas:**
  - [x] VS Code, Git Bash e GitHub.
  - [x] Google Chrome Developer Tools (Network, Console, Application).
- **Tecnologias & Integrações:**
  - [x] React 18, React Router v6, Sass/CSS3, Fetch API / Async-Await.
- **Governança & Documentação:**
  - [x] GitHub Wiki, Issues, Project Boards e Pull Requests estruturados.
  - [x] Pipeline de Integração Contínua (CI) via **GitHub Actions**.

---

## 📝 Histórico de Tarefas & Entregas Iniciais

- [x] Inicialização do projeto com Create React App (`npx create-react-app`).
- [x] Limpeza e estruturação do projeto (favicon, assets, estilos globais).
- [x] Implementação dos componentes de navegação (`Navbar` e `Slogan`).
- [x] Construção da interface da Home (painel de filtros e grid de cards de filmes).
- [x] Consumo inicial da API com Fetch API / Promises e posterior refatoração para `async/await`.
- [x] Criação da rota e página de detalhes (`/movie/:id`).
- [x] Desenvolvimento do componente circular de carregamento de avaliação (Score do Usuário).
- [x] Refatoração declarativa das telas de detalhes para consumo dinâmico do elenco, equipe técnica, trailers no YouTube e recomendações (`Promise.all`).
- [x] Tratamento e formatação de datas em formato brasileiro (`DD/MM/YYYY`) e cálculo de duração em horas e minutos (`Xh Ym`).
- [x] Desenvolvimento do componente modular de **Paginação** reutilizável (`<Pagination />`).
- [x] Configuração da pipeline de CI automatizada com **GitHub Actions** (`.github/workflows/ci.yml`).

---

## ⏱️ Métricas de Performance & Produtividade

Acompanhamento dos ciclos de desenvolvimento dedicados à construção do MVP:
- **08/02:** 07:00 – 11:44
- **07/02:** 07:00 – 12:40 | 13:40 – 18:05
- **06/02:** 07:30 – 12:35 | 13:20 – 19:40
- **03/02:** 10:50 – 17:30

---

## 🎨 Layout da Aplicação

### Visualização Desktop
<p align="center" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img alt="Desktop 1" src="./.github/api-tmdb-1.jpg" width="380px">
  <img alt="Desktop 2" src="./.github/api-tmdb-2.jpg" width="380px">
  <img alt="Desktop 3" src="./.github/api-tmdb-3.jpg" width="380px">
  <img alt="Desktop 4" src="./.github/api-tmdb-4.jpg" width="380px">
  <img alt="Desktop 5" src="./.github/api-tmdb-5.jpg" width="380px">
</p>

### Visualização Mobile
<p align="center">
  <img alt="Mobile Preview" src="./.github/mobile-tmdb.jpg" height="400px">
</p>

---

## 🗺️ Plano Mestre de Evolução (70 Issues)

Para guiar a reativação, escalabilidade e qualidade do ecossistema do **Movies**, o roadmap foi fatiado em **70 Issues estruturadas** divididas em 7 Fases estratégicas:

### 🚀 Fase 1: Governança, CI/CD e Qualidade (Issues 01–10)
1. **Issue #01 — `[DevOps] Setup do GitHub Actions para Pipeline de CI`**: Configuração do workflow automatizado de validação de PRs.
2. **Issue #02 — `[DevOps] Integração de Linter e Formatador (ESLint & Prettier)`**: Padronização de estilo de código com Husky e `lint-staged`.
3. **Issue #03 — `[QA] Configuração do Ambiente de Testes (Jest + React Testing Library)`**: Mocks globais e scripts de testes unitários.
4. **Issue #04 — `[DevOps] Variáveis de Ambiente e Segurança (.env)`**: Isolamento de chaves secretas e credenciais de API.
5. **Issue #05 — `[QA] Teste Unitário dos Utilitários de Data e Duração`**: Garantia de cobertura para `formatDate` e `formatRuntime`.
6. **Issue #06 — `[DevOps] Deploy Automatizado com Vercel/GitHub Pages`**: Pipeline de entrega contínua (CD) disparada na `main`.
7. **Issue #07 — `[QA] Teste do Componente de Avaliação`**: Validação declarativa do gráfico circular de pontuação.
8. **Issue #08 — `[Governance] Padronização de Issue Templates (User Stories)`**: Modelos para cadastro de bugs e novas funcionalidades.
9. **Issue #09 — `[Governance] Criação do CONTRIBUTING.md e Guia do Git`**: Documentação de fluxo de branches e regras de contribuição.
10. **Issue #10 — `[QA] Setup de Testes End-to-End com Cypress/Playwright`**: Automação de testes E2E dos fluxos principais.

### ⚙️ Fase 2: Refatoração do Core & Assincronismo (Issues 11–20)
11. **Issue #11 — `[Tech] Migração de Fetch/Then para Async/Await`**: Refatoração global de chamadas HTTP para padrão moderno.
12. **Issue #12 — `[Tech] Tratamento de Erros com Try/Catch e Fallbacks`**: Telas de erro amigáveis para falhas de rede na API.
13. **Issue #13 — `[Tech] Remoção de Manipulação Direta do DOM em Details`**: Substituição do `querySelector` por estado nativo React.
14. **Issue #14 — `[Tech] Camada de Serviço Centralizada (Service Layer)`**: Módulo desacoplado de chamadas à TMDB API.
15. **Issue #15 — `[Tech] Loading Skeletons na Home`**: Esqueletos animados de carregamento para os cards da grid.
16. **Issue #16 — `[Tech] Loading Skeletons em Details`**: Feedback visual enquanto carrega banner e elenco.
17. **Issue #17 — `[Tech] Tratamento para Filmes Sem Poster`**: Imagem placeholder quando o item não tiver imagem na API.
18. **Issue #18 — `[Tech] Normalização do Objeto Movie`**: Padronização da estrutura de dados antes do consumo da UI.
19. **Issue #19 — `[Tech] Scroll Automático ao Alternar Rotas`**: Garantia de rolagem para o topo ao trocar de tela.
20. **Issue #20 — `[Tech] Hook Customizado useFetch`**: Abstração para chamadas HTTP reutilizáveis.

### 🎨 Fase 3: Refinamento de UX/UI, Filtros e Paginação (Issues 21–30)
21. **Issue #21 — `[Feature] Consumo Dinâmico de Gêneros (GET /genre/movie/list)`**: Integração oficial dos gêneros da TMDB.
22. **Issue #22 — `[Feature] Filtro Múltiplo de Gêneros na Home`**: Filtro combinado ativando o endpoint `/discover/movie`.
23. **Issue #23 — `[Feature] Desseleção e Limpeza de Filtros`**: Remoção de gêneros ativos em tempo real.
24. **Issue #24 — `[Feature] Componente de Paginação Dinâmica`**: Substituição de números estáticos por controles inteligentes.
25. **Issue #25 — `[Feature] Limite de Páginas e Navegação Seguro`**: Proteção contra extrapolação do limite da API (500 páginas).
26. **Issue #26 — `[Feature] Busca Global com Debounce`**: Barra de pesquisa inteligente com delay programado.
27. **Issue #27 — `[UX] Destaque Visual para Gêneros Selecionados`**: Feedback visual destacado nos botões ativos.
28. **Issue #28 — `[UX] Mensagem de Nenhum Resultado Encontrado`**: Estado vazio para buscas sem retorno.
29. **Issue #29 — `[UX] Correção de Tipografia e Unidades do CSS (rem)`**: Ajuste do reset e escala de fontes globais.
30. **Issue #30 — `[UX] Transições Suaves entre Páginas`**: Animações suaves de transição na interface.

### 📱 Fase 4: Responsividade e Acessibilidade (Issues 31–40)
31. **Issue #31 — `[UI] Adaptação Responsive-First da Home`**: Grid fluida para telas de celulares e tablets.
32. **Issue #32 — `[UI] Adaptação Responsive da Tela de Details`**: Reorganização vertical dos elementos em mobile.
33. **Issue #33 — `[UI] Carrossel Horizontal para Elenco`**: Scroll de elenco otimizado para navegação por toque.
34. **Issue #34 — `[UI] Player de Trailer Responsivo (16:9)`**: Container adaptável para o iframe do YouTube.
35. **Issue #35 — `[A11y] Atributos Alt Descritivos em Imagens`**: Acessibilidade para leitores de tela em posters e fotos.
36. **Issue #36 — `[A11y] Navegação por Teclado nos Filtros e Botoes`**: Foco e acessibilidade por tecla Tab.
37. **Issue #37 — `[A11y] Contraste de Cores WCAG`**: Validação e ajuste de contraste nos textos e botões.
38. **Issue #38 — `[UI] Botão Flutuante de Retorno`**: Ajuste no posicionamento do botão de voltar à lista.
39. **Issue #39 — `[UI] Componentes Navbar e Slogan Responsivos`**: Alinhamento do cabeçalho institucional.
40. **Issue #40 — `[UI] Testes Cross-Browser`**: Garantia de compatibilidade em navegadores diversos.

### 🍿 Fase 5: Integração Dinâmica e Mídia em Details (Issues 41–50)
41. **Issue #41 — `[Feature] Elenco Dinâmico (GET /movie/{id}/credits)`**: Substituição de atores estáticos pelos dados reais.
42. **Issue #42 — `[Feature] Equipe Técnica e Direção Dinâmica`**: Exibição dos diretores e roteiristas na ficha técnica.
43. **Issue #43 — `[Feature] Trailer Oficial Dinâmico (GET /movie/{id}/videos)`**: Player com vídeo oficial do filme.
44. **Issue #44 — `[Feature] Recomendações Dinâmicas`**: Exibição de filmes similares com links de navegação.
45. **Issue #45 — `[Feature] Navegação Encadeada entre Recomendações`**: Troca contínua de detalhes entre filmes recomendados.
46. **Issue #46 — `[Feature] Formatação de Orçamento e Receita`**: Exibição financeira formatada em dólares.
47. **Issue #47 — `[Feature] Produtoras e Países de Origem`**: Informações institucionais do filme.
48. **Issue #48 — `[Feature] Slogan do Filme (Tagline)`**: Exibição da frase de impacto oficial do filme.
49. **Issue #49 — `[Feature] Modal de Zoom para o Poster`**: Visualização ampliada do poster em alta definição.
50. **Issue #50 — `[Feature] Classificação Indicativa`**: Certificação de faixa etária recomendada por país.

### 🧠 Fase 6: Estado Avançado, SEO e Cache (Issues 51–60)
51. **Issue #51 — `[Tech] Integração com TanStack Query (React Query)`**: Cache automatizado de requisições.
52. **Issue #52 — `[Tech] Persistência de Filtros na URL`**: Sincronização do estado de busca e página na Query String.
53. **Issue #53 — `[SEO] Metadados Dinâmicos com React Helmet`**: Títulos e Open Graph para redes sociais por filme.
54. **Issue #54 — `[Tech] Favoritar Filmes em LocalStorage`**: Gerenciamento de filmes favoritados pelo usuário.
55. **Issue #55 — `[Feature] Tela Dedicada aos Meus Favoritos`**: Rota `/favorites` para exibição de itens salvos.
56. **Issue #56 — `[Tech] Suporte Offline/PWA com Service Workers`**: Acesso básico e cache em situações offline.
57. **Issue #57 — `[Tech] Otimização de Imagens (SrcSet)`**: Download adaptável de posters de acordo com a tela.
58. **Issue #58 — `[Tech] Monitoramento com Web Vitals`**: Otimização de métricas de performance (LCP, FID, CLS).
59. **Issue #59 — `[SEO] Geração de Sitemap e Robots.txt`**: Estratégias de indexação em buscadores.
60. **Issue #60 — `[Tech] Controle de Rate Limit e Cache Local`**: Mitigação de requisições excessivas à API.

### 🏆 Fase 7: Recursos Especiais, Analytics e Encerramento (Issues 61–70)
61. **Issue #61 — `[UX/Content] Feature Especial: Timeline 007`**: Trilha temática da franquia James Bond.
62. **Issue #62 — `[Analytics] Métricas de Uso e Comportamento`**: Monitoramento de cliques e buscas mais populares.
63. **Issue #63 — `[Feature] Sistema de Avaliação do Usuário`**: Possibilidade do usuário atribuir sua própria nota ao filme.
64. **Issue #64 — `[Feature] Compartilhamento em Redes Sociais`**: Botões rápidos para envio via WhatsApp e Twitter.
65. **Issue #65 — `[Feature] Toggle de Dark/Light Mode`**: Suporte a temas claro e escuro.
66. **Issue #66 — `[Feature] Filtro por Ano de Lançamento`**: Seleção de filmes por décadas e anos.
67. **Issue #67 — `[Documentation] Atualização Geral do README Profissional`**: Documentação executiva do repositório.
68. **Issue #68 — `[Governance] Consolidação da GitHub Wiki`**: Documentação técnica e arquitetural completa.
69. **Issue #69 — `[QA] Auditoria do Lighthouse (Nota ≥90)`**: Validação final de performance, acessibilidade e SEO.
70. **Issue #70 — `[Product] Release Oficial v2.0.0 & Retrospectiva`**: Encerramento do ciclo e publicação da versão final.

---

## 💡 Referências & Links Úteis

- [Documentation — Create React App](https://pt-br.reactjs.org/docs/create-a-new-react-app.html)
- [API Documentation — The Movie Database (TMDB v3)](https://developers.themoviedb.org/3/getting-started/introduction)
- [Figma Layout oficial do desafio](https://www.figma.com/file/rM7WPqhLY9ObnGzSCeWLxB/Teste-Front-End)
- [Artigo — Guia de Paginação Customizada em React](https://www.freecodecamp.org/portuguese/news/como-criar-uma-paginacao-personalizada-em-react/)
- [CSS Tricks — A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

---

## 👨‍💻 Autor

Feito com ❤️ por **Douglas A B Novato**.  
👋🏽 Entre em contato e acompanhe outros projetos:

- **LinkedIn:** [linkedin.com/in/douglasabnovato](https://www.linkedin.com/in/douglasabnovato/)
- **GitHub:** [@douglasabnovato](https://github.com/douglasabnovato)
- **Website:** [douglasabnovato.dev](https://douglasabnovato.dev)

---
*Fonte e inspiração do desafio original fornecidos pela equipe de engenharia da **Promobit**.* 👋