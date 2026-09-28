/*
 * Home · listagem de filmes com busca (debounce de 500 ms), filtro por gêneros,
 * paginação e estado sincronizado na URL. Trata carregando, vazio, erro e sucesso.
 */
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
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

/* Lê busca, página e gêneros da query string. */
function readInitialState(searchParams) {
  const genres = searchParams.get("genres");
  return {
    search: searchParams.get("search") || "",
    page: Number(searchParams.get("page")) || 1,
    genres: genres ? genres.split(",").map(Number).filter(Boolean) : [],
  };
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
  const [initial] = useState(() => readInitialState(searchParams));

  const [selectedGenres, setSelectedGenres] = useState(initial.genres);
  const [searchQuery, setSearchQuery] = useState(initial.search);
  const [debouncedQuery, setDebouncedQuery] = useState(initial.search);
  const [currentPage, setCurrentPage] = useState(initial.page);

  const genresRequest = useFetch((options) => tmdbService.getGenres(options), []);
  const moviesRequest = useFetch(
    (options) => loadMovies(debouncedQuery, selectedGenres, currentPage, options),
    [debouncedQuery, selectedGenres.join(","), currentPage]
  );

  useEffect(() => {
    document.title = "Movie's · Descubra filmes";
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const params = {};
    if (debouncedQuery.trim() !== "") params.search = debouncedQuery;
    else if (selectedGenres.length > 0) params.genres = selectedGenres.join(",");
    if (currentPage > 1) params.page = currentPage;
    setSearchParams(params, { replace: true });
  }, [debouncedQuery, selectedGenres, currentPage, setSearchParams]);

  const genres = genresRequest.data?.genres || [];
  const movies = moviesRequest.data?.results || [];
  const totalPages = Math.min(moviesRequest.data?.total_pages || 1, MAX_PAGES);

  /* Liga ou desliga um gênero e limpa a busca (RN01). */
  const handleGenreClick = (genreId) => {
    setSearchQuery("");
    setDebouncedQuery("");
    setCurrentPage(1);
    setSelectedGenres((previous) =>
      previous.includes(genreId) ? previous.filter((id) => id !== genreId) : [...previous, genreId]
    );
  };

  /* Atualiza o termo digitado e limpa os gêneros (RN01). */
  const handleSearchChange = (event) => {
    setSelectedGenres([]);
    setCurrentPage(1);
    setSearchQuery(event.target.value);
  };

  /* Troca de página e volta ao topo. */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
          title={isConfig ? "Aplicação sem chave da TMDB" : "Não foi possível carregar os filmes"}
          message={moviesRequest.error.message}
          onRetry={isConfig ? undefined : moviesRequest.retry}
        />
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
          <Link to={`/movie/${movie.id}`} aria-label={`Ver detalhes do filme ${title}`}>
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

      {!moviesRequest.error && (
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
