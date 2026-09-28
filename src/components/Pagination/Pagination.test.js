/* Pagination.test.js · janela de páginas e acessibilidade. */
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination, { getPageWindow } from "./index";

describe("Components / Pagination", () => {
  it("calcula a janela centrada e respeita as bordas", () => {
    expect(getPageWindow(1, 500, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageWindow(10, 500, 5)).toEqual([8, 9, 10, 11, 12]);
    expect(getPageWindow(500, 500, 5)).toEqual([496, 497, 498, 499, 500]);
    expect(getPageWindow(2, 3, 5)).toEqual([1, 2, 3]);
  });

  it("não renderiza com uma única página", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("marca a página atual com aria-current e desabilita voltar na primeira", () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Página 1" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Página anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Primeira página" })).toBeDisabled();
  });

  it("chama onPageChange com a página escolhida", () => {
    const onPageChange = jest.fn();
    render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Próxima página" }));
    fireEvent.click(screen.getByRole("button", { name: "Última página" }));
    fireEvent.click(screen.getByRole("button", { name: "Página 5" }));
    expect(onPageChange.mock.calls).toEqual([[4], [10], [5]]);
  });
});
/* fim de Pagination.test.js */
