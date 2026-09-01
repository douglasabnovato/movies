import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { tmdbService } from "../../services/tmdbApi";
import "./styles.css";

const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";

function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 1. Carregar lista de gêneros oficial da API via tmdbService
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

  // 2. Buscar filmes (Populares ou Filtrados por Gênero) via tmdbService
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const data =
        selectedGenres.length > 0
          ? await tmdbService.getDiscoverMovies(selectedGenres, currentPage)
          : await tmdbService.getPopularMovies(currentPage);

      setMovies(data.results || []);
      // TMDB limita consultas públicas em 500 páginas
      setTotalPages(data.total_pages > 500 ? 500 : data.total_pages || 1);
    } catch (error) {
      console.error("Erro ao carregar filmes:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedGenres]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // 3. Alternar seleção de gênero
  const handleGenreClick = (genreId) => {
    setCurrentPage(1); // Reseta para a primeira página ao mudar filtros
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genreId)
        ? prevSelected.filter((id) => id !== genreId)
        : [...prevSelected, genreId]
    );
  };

  // 4. Mudar de página e rolar para o topo
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
          <div className="loading-state">Carregando filmes...</div>
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
            Nenhum filme encontrado para os filtros selecionados.
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