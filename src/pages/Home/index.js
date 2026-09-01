import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { MovieCardSkeleton } from "../../components/Skeleton";
import { tmdbService } from "../../services/tmdbApi";
import "../../components/Skeleton/styles.css";
import "./styles.css";

const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialGenres = searchParams.get("genres")
    ? searchParams.get("genres").split(",").map(Number)
    : [];

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState(initialGenres);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const params = {};

    if (debouncedQuery.trim() !== "") {
      params.search = debouncedQuery;
    } else if (selectedGenres.length > 0) {
      params.genres = selectedGenres.join(",");
    }

    if (currentPage > 1) {
      params.page = currentPage;
    }

    setSearchParams(params, { replace: true });
  }, [debouncedQuery, selectedGenres, currentPage, setSearchParams]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await tmdbService.getGenres();
        if (data.genres) setGenres(data.genres);
      } catch (error) {
        console.error("Erro ao carregar gêneros:", error);
      }
    };
    fetchGenres();
  }, []);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (debouncedQuery.trim() !== "") {
        data = await tmdbService.searchMovies(debouncedQuery, currentPage);
      } else if (selectedGenres.length > 0) {
        data = await tmdbService.getDiscoverMovies(selectedGenres, currentPage);
      } else {
        data = await tmdbService.getPopularMovies(currentPage);
      }

      setMovies(data.results || []);
      setTotalPages(data.total_pages > 500 ? 500 : data.total_pages || 1);
    } catch (error) {
      console.error("Erro ao carregar filmes:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedGenres, debouncedQuery]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleGenreClick = (genreId) => {
    setSearchQuery("");
    setCurrentPage(1);
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genreId)
        ? prevSelected.filter((id) => id !== genreId)
        : [...prevSelected, genreId]
    );
  };

  const handleSearchChange = (e) => {
    setSelectedGenres([]);
    setCurrentPage(1);
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="main">
      <header className="top">
        <nav className="navbar" aria-label="Navegação Principal">
          <div className="title-site">
            <h1 className="title-text">
              TMDB
              <span className="title-obj"></span>
            </h1>
          </div>
        </nav>

        <section className="slogan" aria-label="Apresentação do Site">
          <p className="slogan-text">
            Milhões de filmes, séries e pessoas para descobrir. Explore já.
          </p>
        </section>

        <section className="search-bar-container" aria-label="Busca de Filmes">
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
            aria-label="Campo de pesquisa de filmes"
          />
        </section>

        <section className="filter" aria-label="Filtro por Gênero">
          <div className="filter-container">
            <h2 className="filter-text">FILTRE POR:</h2>

            <div className="filter-box" role="group" aria-label="Categorias de filmes">
              {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre.id);
                return (
                  <button
                    key={genre.id}
                    className={`filter-tag ${isSelected ? "selected" : ""}`}
                    onClick={() => handleGenreClick(genre.id)}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`Filtrar por ${genre.name}`}
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

      <section className="films" aria-label="Lista de Filmes">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))
        ) : movies.length > 0 ? (
          movies.map((movie) => (
            <article key={movie.id} className="film">
              <Link to={`/movie/${movie.id}`} aria-label={`Ver detalhes do filme ${movie.title || movie.original_title}`}>
                <div className="card">
                  <img
                    src={
                      movie.poster_path
                        ? `${IMAGE_PATH}${movie.poster_path}`
                        : "https://via.placeholder.com/176x264?text=Sem+Poster"
                    }
                    alt={`Pôster do filme ${movie.title || movie.original_title}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/176x264?text=Sem+Poster";
                    }}
                  />
                  <h3 className="title-movie">
                    {movie.title || movie.original_title}
                  </h3>
                  <p className="title-date">
                    {movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString("pt-BR")
                      : "Data desconhecida"}
                  </p>
                </div>
              </Link>
            </article>
          ))
        ) : (
          <div className="empty-state" role="status">
            Nenhum filme encontrado para os filtros selecionados.
          </div>
        )}
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        maxVisible={5}
        showFirstLast={true}
        showPrevNext={true}
        variant="purple"
      />
    </main>
  );
}

export default Home;