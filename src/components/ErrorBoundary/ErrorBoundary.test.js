/* ErrorBoundary.test.js · mostra a mensagem de erro no lugar da árvore que falhou. */
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./index";

/* Componente que sempre falha ao renderizar. */
function Broken() {
  throw new Error("falha de teste");
}

describe("Components / ErrorBoundary", () => {
  it("renderiza os filhos quando não há erro", () => {
    render(<ErrorBoundary><p>Conteúdo</p></ErrorBoundary>);
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });

  it("mostra a mensagem e o botão de recarregar quando um filho falha", () => {
    /* Silencia o log esperado sem desfazer o espião global de setupTests. */
    const originalError = console.error;
    console.error = jest.fn();
    render(<ErrorBoundary><Broken /></ErrorBoundary>);
    console.error = originalError;
    expect(screen.getByRole("alert")).toHaveTextContent("Algo deu errado");
    expect(screen.getByRole("button", { name: "Recarregar" })).toBeInTheDocument();
  });
});
/* fim de ErrorBoundary.test.js */
