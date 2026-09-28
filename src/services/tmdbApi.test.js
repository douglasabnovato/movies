/* tmdbApi.test.js · chave, cache e erros tipados da camada de serviço. */
import { fetchFromTMDB, tmdbService, responseCache } from "./tmdbApi";

const ORIGINAL_KEY = process.env.REACT_APP_TMDB_KEY;

/* Cria uma resposta falsa do fetch. */
function mockResponse(status, body = {}) {
  return Promise.resolve({ ok: status >= 200 && status < 300, status, json: () => Promise.resolve(body) });
}

describe("Services / tmdbApi", () => {
  beforeEach(() => {
    process.env.REACT_APP_TMDB_KEY = "chave-de-teste";
    responseCache.clear();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    process.env.REACT_APP_TMDB_KEY = ORIGINAL_KEY;
  });

  it("falha com kind=config quando a chave não existe e não chama a rede", async () => {
    delete process.env.REACT_APP_TMDB_KEY;
    await expect(fetchFromTMDB("/movie/popular")).rejects.toMatchObject({ kind: "config" });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("envia idioma pt-BR e a chave do ambiente", async () => {
    global.fetch.mockReturnValue(mockResponse(200, { results: [] }));
    await tmdbService.getPopularMovies(2);
    const url = global.fetch.mock.calls[0][0];
    expect(url).toContain("/movie/popular?");
    expect(url).toContain("api_key=chave-de-teste");
    expect(url).toContain("language=pt-BR");
    expect(url).toContain("page=2");
  });

  it("usa o cache na segunda chamada igual", async () => {
    global.fetch.mockReturnValue(mockResponse(200, { results: [1] }));
    await tmdbService.getPopularMovies(1);
    const second = await tmdbService.getPopularMovies(1);
    expect(second).toEqual({ results: [1] });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("não guarda a chave da API na chave do cache", async () => {
    global.fetch.mockReturnValue(mockResponse(200, {}));
    await tmdbService.getGenres();
    const keys = Array.from(responseCache.store.keys()).join("|");
    expect(keys).not.toContain("chave-de-teste");
  });

  it("traduz 404 em kind=not_found", async () => {
    global.fetch.mockReturnValue(mockResponse(404));
    await expect(tmdbService.getMovieFull(0)).rejects.toMatchObject({ kind: "not_found", status: 404 });
  });

  it("traduz 500 em kind=http e não guarda em cache", async () => {
    global.fetch.mockReturnValue(mockResponse(500));
    await expect(tmdbService.getGenres()).rejects.toMatchObject({ kind: "http", status: 500 });
    expect(responseCache.size).toBe(0);
  });

  it("traduz falha de rede em kind=network", async () => {
    global.fetch.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(tmdbService.getGenres()).rejects.toMatchObject({ kind: "network" });
  });

  it("traduz cancelamento em kind=aborted", async () => {
    const abortError = new Error("aborted");
    abortError.name = "AbortError";
    global.fetch.mockRejectedValue(abortError);
    await expect(tmdbService.getGenres()).rejects.toMatchObject({ kind: "aborted" });
  });

  it("pede o detalhe completo em uma única requisição", async () => {
    global.fetch.mockReturnValue(mockResponse(200, { id: 1 }));
    await tmdbService.getMovieFull(1);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][0]).toContain(
      "append_to_response=credits%2Cvideos%2Crecommendations"
    );
  });
});
/* fim de tmdbApi.test.js */
