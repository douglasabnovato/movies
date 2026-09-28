/* Details.test.js · mapeamento da resposta única e estados da página. */
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Details, { mapMovieResponse } from "./index";
import { tmdbService, TmdbError } from "../../services/tmdbApi";

jest.mock("../../services/tmdbApi", () => {
  const actual = jest.requireActual("../../services/tmdbApi");
  return { ...actual, tmdbService: { getMovieFull: jest.fn() } };
});

/* Renderiza a página na rota /movie/:id. */
function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/movie/:id" element={<Details />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Pages / Details", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it("separa elenco, equipe, trailer e recomendações", () => {
    const mapped = mapMovieResponse({
      id: 1,
      credits: { cast: Array.from({ length: 12 }, (_, i) => ({ id: i })), crew: [{ id: 1 }] },
      videos: { results: [{ type: "Teaser", site: "YouTube", key: "x" }, { type: "Trailer", site: "YouTube", key: "abc" }] },
      recommendations: { results: [{ id: 9 }] },
    });
    expect(mapped.cast).toHaveLength(10);
    expect(mapped.trailerKey).toBe("abc");
    expect(mapped.recommendations).toEqual([{ id: 9 }]);
  });

  it("mostra o filme e atualiza o título da aba", async () => {
    tmdbService.getMovieFull.mockResolvedValue({ id: 5, title: "Filme C", vote_average: 7.5, release_date: "2020-01-02" });
    renderAt("/movie/5");
    expect(await screen.findByRole("heading", { name: "Filme C" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Avaliação dos usuários: 75%" })).toBeInTheDocument();
    expect(document.title).toBe("Filme C · Movie's");
  });

  it("diferencia filme inexistente de falha de rede", async () => {
    tmdbService.getMovieFull.mockRejectedValue(new TmdbError("not_found", "Conteúdo não encontrado.", 404));
    renderAt("/movie/0");
    expect(await screen.findByRole("alert")).toHaveTextContent("Filme não encontrado");
    expect(screen.queryByRole("button", { name: "Tentar novamente" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voltar para a lista" })).toBeInTheDocument();
  });
});
/* fim de Details.test.js */
