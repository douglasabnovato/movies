/* Home.test.js · estados de sucesso, vazio, erro e retry da listagem. */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./index";
import { tmdbService, TmdbError } from "../../services/tmdbApi";

jest.mock("../../services/tmdbApi", () => {
  const actual = jest.requireActual("../../services/tmdbApi");
  return {
    ...actual,
    tmdbService: {
      getGenres: jest.fn(),
      getPopularMovies: jest.fn(),
      getDiscoverMovies: jest.fn(),
      searchMovies: jest.fn(),
    },
  };
});

/* Renderiza a Home dentro de um roteador em memória. */
function renderHome() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Home />
    </MemoryRouter>
  );
}

describe("Pages / Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    tmdbService.getGenres.mockResolvedValue({ genres: [{ id: 28, name: "Ação" }] });
  });

  it("lista os filmes com a data no formato brasileiro, sem erro de fuso", async () => {
    tmdbService.getPopularMovies.mockResolvedValue({
      results: [{ id: 1, title: "Filme A", release_date: "2024-05-01", poster_path: null }],
      total_pages: 1,
    });
    renderHome();
    expect(await screen.findByText("Filme A")).toBeInTheDocument();
    expect(screen.getByText("01/05/2024")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver detalhes do filme Filme A" })).toHaveAttribute("href", "/movie/1");
  });

  it("mostra o estado vazio", async () => {
    tmdbService.getPopularMovies.mockResolvedValue({ results: [], total_pages: 0 });
    renderHome();
    expect(await screen.findByRole("status")).toHaveTextContent("Nenhum filme encontrado");
  });

  it("mostra erro de rede com Tentar novamente e recupera", async () => {
    tmdbService.getPopularMovies
      .mockRejectedValueOnce(new TmdbError("network", "Sem conexão com a TMDB."))
      .mockResolvedValueOnce({ results: [{ id: 2, title: "Filme B" }], total_pages: 1 });
    renderHome();
    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível carregar os filmes");
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByText("Filme B")).toBeInTheDocument();
  });

  it("explica a falta de chave sem oferecer retry", async () => {
    tmdbService.getGenres.mockRejectedValue(new TmdbError("config", "Chave da TMDB não configurada."));
    tmdbService.getPopularMovies.mockRejectedValue(new TmdbError("config", "Chave da TMDB não configurada."));
    renderHome();
    expect(await screen.findByRole("alert")).toHaveTextContent("Aplicação sem chave da TMDB");
    expect(screen.queryByRole("button", { name: "Tentar novamente" })).not.toBeInTheDocument();
  });

  it("filtra por gênero usando o endpoint discover", async () => {
    tmdbService.getPopularMovies.mockResolvedValue({ results: [], total_pages: 1 });
    tmdbService.getDiscoverMovies.mockResolvedValue({ results: [{ id: 3, title: "Ação 1" }], total_pages: 1 });
    renderHome();
    fireEvent.click(await screen.findByRole("button", { name: "Ação" }));
    expect(await screen.findByText("Ação 1")).toBeInTheDocument();
    expect(tmdbService.getDiscoverMovies).toHaveBeenCalledWith([28], 1, expect.any(Object));
  });
});
/* fim de Home.test.js */
