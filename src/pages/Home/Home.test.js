/* Home.test.js · estados de sucesso, vazio, erro e retry da listagem. */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Link, MemoryRouter, useLocation } from "react-router-dom";
import Home, { parsePage } from "./index";
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

/* Mostra a query string atual e permite mudar o endereço com a Home aberta. */
function UrlProbe() {
  const location = useLocation();
  return (
    <>
      <span data-testid="url">{location.search}</span>
      <Link to="/?page=3">ir para a página 3</Link>
      <Link to="/?genres=28">ir para o gênero</Link>
      <Link to="/?search=matrix">ir para a busca</Link>
    </>
  );
}

/* Renderiza a Home dentro de um roteador em memória. */
function renderHome(entry = "/") {
  return render(
    <MemoryRouter initialEntries={[entry]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Home />
      <UrlProbe />
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

  it.each([
    ["3", 3],
    ["500", 500],
    [null, 1],
    ["abc", 1],
    ["-1", 1],
    ["2.5", 1],
    ["9999", 1],
  ])("interpreta a página %s da URL como %i", (value, expected) => {
    expect(parsePage(value)).toBe(expected);
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
    expect(await screen.findByRole("alert")).toHaveTextContent("Problema com a chave da TMDB");
    expect(screen.queryByRole("button", { name: "Tentar novamente" })).not.toBeInTheDocument();
  });

  it("filtra por gênero usando o endpoint discover", async () => {
    tmdbService.getPopularMovies.mockResolvedValue({ results: [], total_pages: 1 });
    tmdbService.getDiscoverMovies.mockResolvedValue({ results: [{ id: 3, title: "Ação 1" }], total_pages: 1 });
    renderHome();
    fireEvent.click(await screen.findByRole("button", { name: "Ação" }));
    expect(await screen.findByText("Ação 1")).toBeInTheDocument();
    expect(tmdbService.getDiscoverMovies).toHaveBeenCalledWith([28], 1, expect.any(Object));
    expect(screen.getByTestId("url")).toHaveTextContent("?genres=28");
  });

  it("segue a página quando o endereço muda com a Home aberta", async () => {
    tmdbService.getPopularMovies.mockResolvedValue({ results: [{ id: 4, title: "Filme D" }], total_pages: 5 });
    renderHome();
    await screen.findByText("Filme D");
    fireEvent.click(screen.getByRole("link", { name: "ir para a página 3" }));
    await waitFor(() => expect(tmdbService.getPopularMovies).toHaveBeenCalledWith(3, expect.any(Object)));
    expect(screen.getByTestId("url")).toHaveTextContent("?page=3");
    expect(await screen.findByRole("button", { name: "Página 3" })).toHaveAttribute("aria-current", "page");
  });

  it("segue os gêneros quando o endereço muda com a Home aberta", async () => {
    tmdbService.getPopularMovies.mockResolvedValue({ results: [{ id: 4, title: "Filme D" }], total_pages: 1 });
    tmdbService.getDiscoverMovies.mockResolvedValue({ results: [{ id: 3, title: "Ação 1" }], total_pages: 1 });
    renderHome();
    await screen.findByText("Filme D");
    fireEvent.click(screen.getByRole("link", { name: "ir para o gênero" }));
    expect(await screen.findByText("Ação 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ação/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("mostra no campo a busca que chega pelo endereço", async () => {
    tmdbService.getPopularMovies.mockResolvedValue({ results: [{ id: 4, title: "Filme D" }], total_pages: 1 });
    tmdbService.searchMovies.mockResolvedValue({ results: [{ id: 5, title: "Matrix" }], total_pages: 1 });
    renderHome();
    await screen.findByText("Filme D");
    fireEvent.click(screen.getByRole("link", { name: "ir para a busca" }));
    expect(await screen.findByText("Matrix")).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toHaveValue("matrix");
  });

  it("busca depois do debounce, limpa os gêneros e faz uma só chamada", async () => {
    tmdbService.getDiscoverMovies.mockResolvedValue({ results: [{ id: 3, title: "Ação 1" }], total_pages: 1 });
    tmdbService.searchMovies.mockResolvedValue({ results: [{ id: 5, title: "Matrix" }], total_pages: 1 });
    renderHome("/?genres=28&page=2");
    await screen.findByText("Ação 1");
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "mat" } });
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "matrix" } });
    expect(await screen.findByText("Matrix")).toBeInTheDocument();
    expect(tmdbService.searchMovies).toHaveBeenCalledTimes(1);
    expect(tmdbService.searchMovies).toHaveBeenCalledWith("matrix", 1, expect.any(Object));
    expect(screen.getByTestId("url")).toHaveTextContent("?search=matrix");
  });

  it("normaliza a página inválida no endereço", async () => {
    tmdbService.getPopularMovies.mockResolvedValue({ results: [{ id: 4, title: "Filme D" }], total_pages: 1 });
    renderHome("/?page=-1");
    await screen.findByText("Filme D");
    await waitFor(() => expect(screen.getByTestId("url")).toBeEmptyDOMElement());
  });

  it("oferece a volta quando a página passa do total", async () => {
    tmdbService.getPopularMovies.mockImplementation((page) =>
      Promise.resolve(page === 400 ? { results: [], total_pages: 3 } : { results: [{ id: 4, title: "Filme D" }], total_pages: 3 })
    );
    window.scrollTo = jest.fn();
    renderHome("/?page=400");
    expect(await screen.findByRole("status")).toHaveTextContent("Esta página não existe");
    expect(screen.queryByRole("navigation", { name: "Paginação" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Voltar para a primeira página" }));
    expect(await screen.findByText("Filme D")).toBeInTheDocument();
    expect(screen.getByTestId("url")).toBeEmptyDOMElement();
  });
});
/* fim de Home.test.js */
