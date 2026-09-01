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

  // Ler estados iniciais a partir dos parâmetros da URL
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

  // 1. Debounce para o input de busca
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Sincronizar estado local com a URL (Query String)
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

  // 3. Carregar lista de gêneros oficial
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

  // 4. Buscar filmes na API
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

  // 5. Alternar seleção de gênero
  const handleGenreClick = (genreId) => {
    setSearchQuery("");
    setCurrentPage(1);
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genreId)
        ? prevSelected.filter((id) => id !== genreId)
        : [...prevSelected, genreId]
    );
  };

  // 6. Alterar input de busca
  const handleSearchChange = (e) => {
    setSelectedGenres([]);
    setCurrentPage(1);
    setSearchQuery(e.target.value);
  };

  // 7. Paginação
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="main">
      <div className="top">
        <div className="navbar">
          <div className="title-site">
            <div className="title-text">
              TMDB
              <span className="title-obj"></span>
            </div>
          </div>
        </div>

        <div className="slogan">
          <div className="slogan-text">
            Milhões de filmes, séries e pessoas para descobrir. Explore já.
          </div>
        </div>

        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Pesquise por um filme pelo nome..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter">
          <div className="filter-container">
            <div className="filter-text">FILTRE POR:</div>

            <div className="filter-box">
              {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre.id);
                return (
                  <button
                    key={genre.id}
                    className={`filter-tag ${isSelected ? "selected" : ""}`}
                    onClick={() => handleGenreClick(genre.id)}
                    type="button"
                  >
                    <span>{genre.name}</span>
                    {isSelected && <span className="remove-icon"> ✕</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="films">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))
        ) : movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="film">
              <Link to={`/movie/${movie.id}`}>
                <div className="card">
                  <img
                    src={
                      movie.poster_path
                        ? `${IMAGE_PATH}${movie.poster_path}`
                        : "https://via.placeholder.com/176x264?text=Sem+Poster"
                    }
                    alt={movie.title || movie.original_title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/176x264?text=Sem+Poster";
                    }}
                  />
                  <div className="title-movie">
                    {movie.title || movie.original_title}
                  </div>
                  <div className="title-date">
                    {movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString("pt-BR")
                      : "Data desconhecida"}
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="empty-state">
            Nenhum filme encontrado para a pesquisa.
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        maxVisible={5}
        showFirstLast={true}
        showPrevNext={true}
        variant="purple"
      />
    </div>
  );
}

export default Home;