/* NotFound.test.js · endereço desconhecido mostra mensagem e caminho de volta. */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./index";

describe("Pages / NotFound", () => {
  it("explica o erro e oferece o link para a lista", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Página não encontrada");
    expect(screen.getByRole("link", { name: "Voltar para a lista" })).toHaveAttribute("href", "/");
    expect(document.title).toBe("Página não encontrada · Movie's");
  });
});
/* fim de NotFound.test.js */
