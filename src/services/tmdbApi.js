/*
 * tmdbApi.js · camada de serviço da API TMDB v3.
 * A chave vem somente de REACT_APP_TMDB_KEY; erros são normalizados em TmdbError
 * e respostas de sucesso ficam em cache por 5 minutos.
 */
import { TtlCache } from "./cache";

const BASE_URL = "https://api.themoviedb.org/3";

export const responseCache = new TtlCache({ ttlMs: 5 * 60 * 1000, maxEntries: 100 });

export class TmdbError extends Error {
  /* Erro com categoria (config, not_found, http, network, aborted) e status HTTP. */
  constructor(kind, message, status = null) {
    super(message);
    this.name = "TmdbError";
    this.kind = kind;
    this.status = status;
  }
}

/* Lê a chave no momento da chamada para permitir configurar o ambiente nos testes. */
function getApiKey() {
  return process.env.REACT_APP_TMDB_KEY;
}

/* Monta a chave do cache sem a credencial, ordenando os parâmetros para evitar duplicatas. */
function buildCacheKey(endpoint, params) {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return `${endpoint}?${sorted}`;
}

/* Executa o GET na TMDB com cache, cancelamento e erros tipados. */
export async function fetchFromTMDB(endpoint, params = {}, { signal } = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new TmdbError(
      "config",
      "Chave da TMDB não configurada. Crie o arquivo .env com REACT_APP_TMDB_KEY (veja .env.example)."
    );
  }

  const fullParams = { language: "pt-BR", ...params };
  const cacheKey = buildCacheKey(endpoint, fullParams);
  const cached = responseCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const query = new URLSearchParams({ api_key: apiKey, ...fullParams });
  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}?${query.toString()}`, { signal });
  } catch (error) {
    if (error && error.name === "AbortError") {
      throw new TmdbError("aborted", "Requisição cancelada.");
    }
    throw new TmdbError("network", "Sem conexão com a TMDB. Verifique sua internet.");
  }

  if (response.status === 404) {
    throw new TmdbError("not_found", "Conteúdo não encontrado.", 404);
  }
  if (!response.ok) {
    throw new TmdbError("http", `A TMDB respondeu com erro ${response.status}.`, response.status);
  }

  const data = await response.json();
  responseCache.set(cacheKey, data);
  return data;
}

export const tmdbService = {
  /* Lista oficial de gêneros. */
  getGenres: (options) => fetchFromTMDB("/genre/movie/list", {}, options),

  /* Filmes populares por página. */
  getPopularMovies: (page = 1, options) => fetchFromTMDB("/movie/popular", { page }, options),

  /* Filmes filtrados por um ou mais gêneros. */
  getDiscoverMovies: (genreIds = [], page = 1, options) =>
    fetchFromTMDB("/discover/movie", { page, with_genres: genreIds.join(",") }, options),

  /* Busca por nome. */
  searchMovies: (query, page = 1, options) =>
    fetchFromTMDB("/search/movie", { query, page }, options),

  /* Detalhe completo em uma única requisição (elenco, vídeos e recomendações). */
  getMovieFull: (id, options) =>
    fetchFromTMDB(
      `/movie/${id}`,
      { append_to_response: "credits,videos,recommendations" },
      options
    ),
};
/* fim de tmdbApi.js */
