/*
 * Details · página do filme com ficha, avaliação, elenco, trailer e recomendações.
 * Carrega tudo em uma requisição (append_to_response) e trata 404, erro e carregando.
 */
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { tmdbService } from "../../services/tmdbApi";
import { useFetch } from "../../hooks/useFetch";
import { DetailsSkeleton } from "../../components/Skeleton";
import ErrorState from "../../components/ErrorState";
import { formatDate, formatRuntime } from "../../utils/formatters";
import { imageUrl, handleImageError } from "../../utils/images";
import "../../components/Skeleton/styles.css";
import "../../components/ErrorState/styles.css";
import "./styles.css";

/* Separa a resposta única da TMDB nos blocos usados pela tela. */
export function mapMovieResponse(data) {
  const trailer = data.videos?.results?.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );
  return {
    movie: data,
    cast: data.credits?.cast?.slice(0, 10) || [],
    crew: data.credits?.crew?.slice(0, 5) || [],
    trailerKey: trailer ? trailer.key : null,
    recommendations: data.recommendations?.results?.slice(0, 6) || [],
  };
}

/* Cabeçalho com a marca, que leva de volta à listagem. */
function Brand() {
  return (
    <div className="navbar">
      <div className="title-site">
        <Link to="/" className="title-text" aria-label="TMDB, voltar para a lista de filmes">
          TMDB
          <span className="title-obj" aria-hidden="true"></span>
        </Link>
      </div>
    </div>
  );
}

/* Página de detalhes. */
function Details() {
  const { id } = useParams();
  const { data, loading, error, retry } = useFetch(
    (options) => tmdbService.getMovieFull(id, options).then(mapMovieResponse),
    [id]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    document.title = data?.movie?.title ? `${data.movie.title} · Movie's` : "Movie's";
  }, [data]);

  if (loading) {
    return (
      <div className="main" aria-busy="true">
        <div className="top-details">
          <Brand />
          <DetailsSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    const notFound = error.kind === "not_found";
    return (
      <div className="main">
        <div className="top-details">
          <Brand />
        </div>
        <ErrorState
          title={notFound ? "Filme não encontrado" : "Não foi possível carregar o filme"}
          message={notFound ? "O endereço pode estar errado ou o filme foi removido." : error.message}
          onRetry={notFound || error.kind === "config" ? undefined : retry}
        >
          <Link to="/" className="error-state-link">
            Voltar para a lista
          </Link>
        </ErrorState>
      </div>
    );
  }

  const { movie, cast, crew, trailerKey, recommendations } = data;
  const ratingPercentage = Math.round((movie.vote_average || 0) * 10);

  return (
    <div className="main">
      <div className="top-details">
        <Brand />

        <div className="film-detail">
          <div className="film-banner">
            <img
              src={imageUrl(movie.poster_path, "w500")}
              alt={`Pôster de ${movie.title}`}
              width="383"
              height="574"
              onError={handleImageError}
            />
          </div>

          <div className="film-infos">
            <div className="info-title">
              <h1 className="title-name">{movie.title}</h1>
              <p className="title-head">
                {formatDate(movie.release_date)} (BR) •{" "}
                {movie.genres?.map((genre) => genre.name).join(", ")} •{" "}
                {formatRuntime(movie.runtime)}
              </p>
            </div>

            <div className="info-evaluation">
              <div className="evaluation-loading">
                <div
                  className="circular-progress"
                  role="img"
                  aria-label={`Avaliação dos usuários: ${ratingPercentage}%`}
                  style={{
                    background: `conic-gradient(#14ff00 ${ratingPercentage * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg)`,
                  }}
                >
                  <span className="progress-value" aria-hidden="true">
                    {ratingPercentage}%
                  </span>
                </div>
              </div>
              <p className="evaluation-evaluation">Avaliação dos usuários</p>
            </div>

            <div className="info-sinopse">
              <h2 className="sinopse-title">Sinopse</h2>
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

      {cast.length > 0 && (
        <section className="casts" aria-labelledby="cast-title">
          <h2 className="title-casts" id="cast-title">Elenco principal</h2>
          <div className="list-casts">
            {cast.map((actor) => (
              <div key={actor.id} className="item-cast">
                <img
                  src={imageUrl(actor.profile_path, "w185")}
                  alt=""
                  width="165"
                  height="212"
                  loading="lazy"
                  onError={handleImageError}
                />
                <div className="details-cast">
                  <div className="name-cast">{actor.name}</div>
                  <div className="paper-cast">{actor.character}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {trailerKey && (
        <section className="trailer" aria-labelledby="trailer-title">
          <h2 className="title-trailer" id="trailer-title">Trailer oficial</h2>
          <div className="trailer-container">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}`}
              title={`Trailer de ${movie.title}`}
              loading="lazy"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="recommendations" aria-labelledby="recommendations-title">
          <h2 className="title-recommendations" id="recommendations-title">Recomendações</h2>
          <div className="list-recommendations">
            {recommendations.map((item) => (
              <div key={item.id} className="item-recommendation">
                <Link to={`/movie/${item.id}`} aria-label={`Ver detalhes do filme ${item.title}`}>
                  <img
                    src={imageUrl(item.poster_path, "w185")}
                    alt=""
                    width="165"
                    height="212"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  <div className="details-recommendation">
                    <div className="name-recommendation">{item.title}</div>
                    <div className="paper-recommendation">{formatDate(item.release_date)}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <Link to="/" className="back-to" aria-label="Voltar para a lista de filmes"></Link>
    </div>
  );
}

export default Details;
/* fim de Details */
