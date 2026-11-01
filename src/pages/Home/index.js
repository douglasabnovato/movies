/*
 * Home · listagem de filmes com busca (debounce de 500 ms), filtro por gêneros,
 * paginação e estado sincronizado na URL. Trata carregando, vazio, erro e sucesso.
 */
import React, { useState, useEffect, useRef } from "react";
import { Link, createSearchParams, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import ErrorState from "../../components/ErrorState";
import { MovieCardSkeleton } from "../../components/Skeleton";
import { tmdbService } from "../../services/tmdbApi";
import { useFetch } from "../../hooks/useFetch";
import { formatDate } from "../../utils/formatters";
import { imageUrl, handleImageError } from "../../utils/images";
import "../../components/Skeleton/styles.css";
import "./styles.css";

const MAX_PAGES = 500;
const DEBOUNCE_MS = 500;

/* Aceita só páginas inteiras dentro do limite da TMDB (RN02); o resto vira a página 1. */
export function parsePage(value) {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 && page <= MAX_PAGES ? page : 1;
}

/* Lê busca, página e gêneros da query string; a busca tem precedência sobre os gêneros (RN01). */
function readUrlState(searchParams) {
  const search = searchParams.get("search") || "";
  const genres = searchParams.get("genres");
  return {
    search,
    page: parsePage(searchParams.get("page")),
    genres: !search.trim() && genres ? genres.split(",").map(Number).filter(Boolean) : [],
  };
}

/* Monta a query string canônica do estado da listagem. */
function buildUrlParams({ search, genres, page }) {
  const params = {};
  if (search.trim() !== "") params.search = search;
  else if (genres.length > 0) params.genres = genres.join(",");
  if (page > 1) params.page = String(page);
  return createSearchParams(params);
}

/* Escolhe o endpoint conforme a regra RN01: busca tem precedência sobre gêneros. */
function loadMovies(query, genres, page, options) {
  if (query.trim() !== "") return tmdbService.searchMovies(query.trim(), page, options);
  if (genres.length > 0) return tmdbService.getDiscoverMovies(genres, page, options);
  return tmdbService.getPopularMovies(page, options);
}

/* Página inicial. */
function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  /* A URL é a fonte única do estado; só o texto em digitação fica no componente. */
  const { search: debouncedQuery, genres: selectedGenres, page: currentPage } = readUrlState(searchParams);
  const canonicalParams = buildUrlParams({
    search: debouncedQuery,
    genres: selectedGenres,
    page: currentPage,
  }).toString();
  const [searchQuery, setSearchQuery] = useState(debouncedQuery);
  const lastWrittenSearch = useRef(debouncedQuery);

  const genresRequest = useFetch((options) => tmdbService.getGenres(options), []);
  const moviesRequest = useFetch(
    (options) => loadMovies(debouncedQuery, selectedGenres, currentPage, options),
    [debouncedQuery, selectedGenres.join(","), currentPage]
  );

  useEffect(() => {
    document.title = "Movie's · Descubra filmes";
  }, []);

  /* Grava o estado na URL, que por sua vez atualiza a tela. */
  const updateUrl = (state) => {
    lastWrittenSearch.current = state.search;
    setSearchParams(buildUrlParams(state), { replace: true });
  };

  /* Normaliza endereços com valores inválidos, como page=-1. */
  useEffect(() => {
    if (searchParams.toString() !== canonicalParams) {
      setSearchParams(canonicalParams, { replace: true });
    }
  }, [searchParams, canonicalParams, setSearchParams]);

  /* Acompanha uma busca que mudou por fora, sem apagar o que está sendo digitado. */
  useEffect(() => {
    if (debouncedQuery !== lastWrittenSearch.current) {
      lastWrittenSearch.current = debouncedQuery;
      setSearchQuery(debouncedQuery);
    }
  }, [debouncedQuery]);

  /* Leva o termo digitado para a URL depois do debounce e limpa os gêneros (RN01). */
  useEffect(() => {
    const search = searchQuery.trim() === "" ? "" : searchQuery;
    if (search === debouncedQuery) return undefined;
    const handler = setTimeout(() => updateUrl({ search, genres: [], page: 1 }), DEBOUNCE_MS);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, debouncedQuery]);

  const genres = genresRequest.data?.genres || [];
  const movies = moviesRequest.data?.results || [];
  const totalPages = Math.min(moviesRequest.data?.total_pages || 1, MAX_PAGES);

  /* Liga ou desliga um gênero e limpa a busca (RN01). */
  const handleGenreClick = (genreId) => {
    setSearchQuery("");
    const genres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId];
    updateUrl({ search: "", genres, page: 1 });
  };

  /* Atualiza o termo digitado. */
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  /* Troca de página e volta ao topo. */
  const handlePageChange = (newPage) => {
    updateUrl({ search: debouncedQuery, genres: selectedGenres, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Decide o conteúdo da grade conforme o estado da requisição. */
  const renderFilms = () => {
    if (moviesRequest.loading) {
      return Array.from({ length: 10 }).map((_, index) => <MovieCardSkeleton key={index} />);
    }
    if (moviesRequest.error) {
      const isConfig = moviesRequest.error.kind === "config";
      return (
        <ErrorState
          title={isConfig ? "Problema com a chave da TMDB" : "Não foi possível carregar os filmes"}
          message={moviesRequest.error.message}
          onRetry={isConfig ? undefined : moviesRequest.retry}
        />
      );
    }
    if (movies.length === 0 && currentPage > 1) {
      return (
        <div className="empty-state" role="status">
          <p>Esta página não existe nesta lista.</p>
          <button type="button" className="empty-state-action" onClick={() => handlePageChange(1)}>
            Voltar para a primeira página
          </button>
        </div>
      );
    }
    if (movies.length === 0) {
      return (
        <div className="empty-state" role="status">
          {debouncedQuery.trim()
            ? `Nenhum filme encontrado para "${debouncedQuery.trim()}".`
            : "Nenhum filme encontrado para os filtros selecionados."}
        </div>
      );
    }
    return movies.map((movie) => {
      const title = movie.title || movie.original_title;
      return (
        <article key={movie.id} className="film">
          <Link
            to={`/movie/${movie.id}`}
            state={{ listSearch: searchParams.toString() ? `?${searchParams}` : "" }}
            aria-label={`Ver detalhes do filme ${title}`}
          >
            <div className="card">
              <img
                src={imageUrl(movie.poster_path, "w342")}
                alt=""
                width="176"
                height="264"
                loading="lazy"
                decoding="async"
                onError={handleImageError}
              />
              <h3 className="title-movie">{title}</h3>
              <p className="title-date">{formatDate(movie.release_date)}</p>
            </div>
          </Link>
        </article>
      );
    });
  };

  return (
    <main className="main">
      <header className="top">
        <nav className="navbar" aria-label="Navegação principal">
          <div className="title-site">
            <h1 className="title-text">
              TMDB
              <span className="title-obj" aria-hidden="true"></span>
            </h1>
          </div>
        </nav>

        <section className="slogan" aria-label="Apresentação">
          <p className="slogan-text">
            Milhões de filmes, séries e pessoas para descobrir. Explore já.
          </p>
        </section>

        <section className="search-bar-container" aria-label="Busca de filmes">
          <label htmlFor="search-input" className="sr-only">
            Buscar filme pelo nome
          </label>
          <input
            id="search-input"
            type="search"
            className="search-input"
            placeholder="Pesquise por um filme pelo nome..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </section>

        <section className="filter" aria-label="Filtro por gênero">
          <div className="filter-container">
            <h2 className="filter-text">FILTRE POR:</h2>
            {genresRequest.error && genresRequest.error.kind !== "config" && (
              <p className="filter-error" role="status">
                Não foi possível carregar os gêneros.{" "}
                <button type="button" className="filter-retry" onClick={genresRequest.retry}>
                  Tentar novamente
                </button>
              </p>
            )}
            <div className="filter-box" role="group" aria-label="Gêneros">
              {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre.id);
                return (
                  <button
                    key={genre.id}
                    className={`filter-tag ${isSelected ? "selected" : ""}`}
                    onClick={() => handleGenreClick(genre.id)}
                    type="button"
                    aria-pressed={isSelected}
                  >
                    <span>{genre.name}</span>
                    {isSelected && <span className="remove-icon" aria-hidden="true"> ✕</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </header>

      <section className="films" aria-label="Lista de filmes" aria-busy={moviesRequest.loading}>
        {renderFilms()}
      </section>

      {!moviesRequest.error && (moviesRequest.loading || movies.length > 0) && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          maxVisible={5}
          variant="purple"
        />
      )}
    </main>
  );
}

export default Home;
/* fim de Home */
