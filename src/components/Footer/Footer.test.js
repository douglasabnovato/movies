/* Footer.test.js · atribuição exigida pelos termos da API da TMDB. */
import { render, screen } from "@testing-library/react";
import Footer from "./index";

describe("Components / Footer", () => {
  it("mostra o logo e o aviso de que a TMDB não endossa o site", () => {
    render(<Footer />);
    expect(screen.getByRole("img", { name: "TMDB" })).toBeInTheDocument();
    expect(
      screen.getByText("This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.")
    ).toBeInTheDocument();
  });
});
/* fim de Footer.test.js */
