const API_KEY = process.env.REACT_APP_TMDB_KEY || "0e3950318bf412e11272f2f58c14e062";
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Função utilitária genérica para chamadas HTTP à TMDB com tratamento centralizado de erros.
 */
async function fetchFromTMDB(endpoint, params = {}) {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: "pt-BR",
    ...params,
  });

  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar endpoint ${endpoint}:`, error);
    throw error;
  }
}

// Serviços exportados para consumo dos componentes da aplicação
export const tmdbService = {
  // Buscar lista oficial de gêneros
  getGenres: () => fetchFromTMDB("/genre/movie/list"),

  // Buscar filmes populares por página
  getPopularMovies: (page = 1) => fetchFromTMDB("/movie/popular", { page }),

  // Buscar filmes por filtro de gêneros
  getDiscoverMovies: (genreIds = [], page = 1) =>
    fetchFromTMDB("/discover/movie", {
      page,
      with_genres: genreIds.join(","),
    }),

  // Buscar filmes por nome (Search com Debounce)
  searchMovies: (query, page = 1) =>
    fetchFromTMDB("/search/movie", { query, page }),

  // Buscar detalhes principais do filme
  getMovieDetails: (id) => fetchFromTMDB(`/movie/${id}`),

  // Buscar elenco e equipe técnica
  getMovieCredits: (id) => fetchFromTMDB(`/movie/${id}/credits`),

  // Buscar vídeos e trailers oficiais
  getMovieVideos: (id) => fetchFromTMDB(`/movie/${id}/videos`),

  // Buscar recomendações de filmes similares
  getMovieRecommendations: (id, page = 1) =>
    fetchFromTMDB(`/movie/${id}/recommendations`, { page }),
};