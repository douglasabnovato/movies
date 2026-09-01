import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import "./styles.css";

const API_KEY = process.env.REACT_APP_TMDB_KEY || "0e3950318bf412e11272f2f58c14e062";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_PATH_W500 = "https://image.tmdb.org/t/p/w500";

function Details() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formatação de data (DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return "Data desconhecida";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Formatação de duração (Xh Ym)
  const formatRuntime = (minutes) => {
    if (!minutes) return "Duração indisponível";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Carregamento paralelo das informações do filme
  const fetchMovieDetails = useCallback(async () => {
    setLoading(true);
    try {
      const [movieRes, creditsRes, videosRes, recommendationsRes] = await Promise.all([
        fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`),
        fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=pt-BR`),
        fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=pt-BR`),
        fetch(`${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}&language=pt-BR&page=1`)
      ]);

      const movieData = await movieRes.json();
      const creditsData = await creditsRes.json();
      const videosData = await videosRes.json();
      const recommendationsData = await recommendationsRes.json();

      setMovie(movieData);
      setCast(creditsData.cast ? creditsData.cast.slice(0, 10) : []);
      setCrew(creditsData.crew ? creditsData.crew.slice(0, 5) : []);

      // Busca o trailer oficial no YouTube
      const trailer = videosData.results?.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      setTrailerKey(trailer ? trailer.key : null);

      setRecommendations(
        recommendationsData.results ? recommendationsData.results.slice(0, 6) : []
      );
    } catch (error) {
      console.error("Erro ao carregar detalhes do filme:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieDetails();
    window.scrollTo(0, 0);
  }, [fetchMovieDetails]);

  if (loading) {
    return <div className="loading-container">Carregando detalhes do filme...</div>;
  }

  if (!movie) {
    return <div className="error-container">Filme não encontrado.</div>;
  }

  const ratingPercentage = Math.round((movie.vote_average || 0) * 10);

  return (
    <div className="main">
      <div className="top-details">
        <div className="navbar">
          <div className="title-site">
            <Link to="/" className="title-text">
              TMDB
              <span className="title-obj"></span>
            </Link>
          </div>
        </div>

        <div className="film-detail">
          <div className="film-banner">
            <img
              src={
                movie.poster_path
                  ? `${IMAGE_PATH_W500}${movie.poster_path}`
                  : "https://via.placeholder.com/383x574?text=Sem+Poster"
              }
              alt={movie.title}
            />
          </div>

          <div className="film-infos">
            <div className="info-title">
              <h1 className="title-name">{movie.title}</h1>
              <p className="title-head">
                {formatDate(movie.release_date)} (BR) •{" "}
                {movie.genres?.map((g) => g.name).join(", ")} •{" "}
                {formatRuntime(movie.runtime)}
              </p>
            </div>

            <div className="info-evaluation">
              <div className="evaluation-loading">
                <div
                  className="circular-progress"
                  style={{
                    background: `conic-gradient(#14ff00 ${ratingPercentage * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg)`
                  }}
                >
                  <span className="progress-value">{ratingPercentage}%</span>
                </div>
              </div>
              <p className="evaluation-evaluation">Avaliação dos usuários</p>
            </div>

            <div className="info-sinopse">
              <p className="sinopse-title">Sinopse</p>
              <p className="sinopse-text">
                {movie.overview || "Nenhuma sinopse disponível para este filme."}
              </p>
            </div>

            {crew.length > 0 && (
              <div className="info-datasheet">
                {crew.map((member) => (
                  <div key={`${member.id}-${member.job}`} className="datasheet-1">
                    <p className="datasheet-title">{member.name}</p>
                    <p className="datasheet-text">{member.job}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Elenco Principal */}
      {cast.length > 0 && (
        <div className="casts">
          <div className="title-casts">Elenco Principal</div>
          <div className="list-casts">
            {cast.map((actor) => (
              <div key={actor.id} className="item-cast">
                <img
                  src={
                    actor.profile_path
                      ? `${IMAGE_PATH_W500}${actor.profile_path}`
                      : "https://via.placeholder.com/165x212?text=Sem+Foto"
                  }
                  alt={actor.name}
                />
                <div className="details-cast">
                  <div className="name-cast">{actor.name}</div>
                  <div className="paper-cast">{actor.character}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trailer Oficial */}
      {trailerKey && (
        <div className="trailer">
          <div className="title-trailer">Trailer Oficial</div>
          <div className="trailer-container">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Trailer do Filme"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Recomendações */}
      {recommendations.length > 0 && (
        <div className="recommendations">
          <div className="title-recommendations">Recomendações</div>
          <div className="list-recommendations">
            {recommendations.map((item) => (
              <div key={item.id} className="item-recommendation">
                <Link to={`/movie/${item.id}`}>
                  <img
                    src={
                      item.poster_path
                        ? `${IMAGE_PATH_W500}${item.poster_path}`
                        : "https://via.placeholder.com/165x212?text=Sem+Imagem"
                    }
                    alt={item.title}
                  />
                  <div className="details-recommendation">
                    <div className="name-recommendation">{item.title}</div>
                    <div className="paper-recommendation">
                      {formatDate(item.release_date)}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <Link to="/" className="back-to" title="Voltar para a lista"></Link>
    </div>
  );
}

export default Details;