/* WatchProviders.test.js · onde assistir no Brasil, com e sem dados, e o crédito à JustWatch. */
import { render, screen, within } from "@testing-library/react";
import WatchProviders, { mapWatchProviders } from "./index";

const RESPOSTA = {
  results: {
    US: { flatrate: [{ provider_id: 99, provider_name: "Só nos EUA", display_priority: 0 }] },
    BR: {
      link: "https://www.themoviedb.org/movie/1/watch?locale=BR",
      flatrate: [
        { provider_id: 2, provider_name: "Serviço B", logo_path: "/b.png", display_priority: 5 },
        { provider_id: 1, provider_name: "Serviço A", logo_path: "/a.png", display_priority: 1 },
        { provider_id: 1, provider_name: "Serviço A", logo_path: "/a.png", display_priority: 1 },
      ],
      rent: [{ provider_id: 3, provider_name: "Locadora C", display_priority: 0 }],
      buy: [],
    },
  },
};

describe("Components / WatchProviders", () => {
  it("separa o Brasil por tipo, na ordem da TMDB e sem repetir serviço", () => {
    const grupos = mapWatchProviders(RESPOSTA);
    expect(grupos.map((g) => g.label)).toEqual(["Assinatura", "Aluguel"]);
    expect(grupos[0].providers.map((p) => p.provider_name)).toEqual(["Serviço A", "Serviço B"]);
  });

  it("sem dados do Brasil ou sem a chave na resposta, devolve lista vazia", () => {
    expect(mapWatchProviders({ results: { US: RESPOSTA.results.US } })).toEqual([]);
    expect(mapWatchProviders(undefined)).toEqual([]);
    expect(mapWatchProviders({ results: { BR: { flatrate: "inválido" } } })).toEqual([]);
  });

  it("mostra os serviços com nome visível e o crédito à JustWatch", () => {
    render(<WatchProviders groups={mapWatchProviders(RESPOSTA)} />);
    const assinatura = screen.getByRole("list", { name: "Assinatura" });
    expect(
      within(assinatura)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual(["Serviço A", "Serviço B"]);
    expect(screen.getByRole("list", { name: "Aluguel" })).toHaveTextContent("Locadora C");
    expect(screen.queryByText("Compra")).not.toBeInTheDocument();
    expect(screen.queryByText("Só nos EUA")).not.toBeInTheDocument();
    expect(screen.getByText(/Dados de onde assistir:/)).toHaveTextContent(
      "Dados de onde assistir: JustWatch",
    );
    expect(screen.getByRole("link", { name: "JustWatch" })).toHaveAttribute(
      "href",
      "https://www.justwatch.com/br",
    );
  });

  it("sem dados, avisa e mantém o crédito", () => {
    render(<WatchProviders groups={[]} />);
    expect(screen.getByRole("heading", { name: "Onde assistir no Brasil" })).toBeInTheDocument();
    expect(
      screen.getByText("Ainda não há informação de onde assistir este filme no Brasil."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "JustWatch" })).toBeInTheDocument();
  });
});
/* fim de WatchProviders.test.js */
