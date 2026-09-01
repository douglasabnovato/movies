const API_KEY = process.env.REACT_APP_TMDB_KEY || "0e3950318bf412e11272f2f58c14e062";
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Função utilitária genérica para chamadas HTTP com tratamento de erros.
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

// Servicos exported para consumo dos componentes
export const tmdbService = {
  // Buscar generos oficiais
  getGenres: () => fetchFromTMDB("/genre/movie/list"),

  // Buscar filmes populares
  getPopularMovies: (page = 1) => fetchFromTMDB("/movie/popular", { page }),

  // Buscar filmes por filtro de generos
  getDiscoverMovies: (genreIds = [], page = 1) =>
    fetchFromTMDB("/discover/movie", {
      page,
      with_genres: genreIds.join(","),
    }),

  // Buscar detalhes do filme
  getMovieDetails: (id) => fetchFromTMDB(`/movie/${id}`),

  // Buscar elenco e equipe técnica
  getMovieCredits: (id) => fetchFromTMDB(`/movie/${id}/credits`),

  // Buscar vídeos e trailers
  getMovieVideos: (id) => fetchFromTMDB(`/movie/${id}/videos`),

  // Buscar recomendações
  getMovieRecommendations: (id, page = 1) =>
    fetchFromTMDB(`/movie/${id}/recommendations`, { page }),
};