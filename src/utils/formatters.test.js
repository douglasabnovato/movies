import { formatDate, formatRuntime } from "./formatters";

describe("Utils / Formatters", () => {
  describe("formatDate", () => {
    it("deve formatar data YYYY-MM-DD para DD/MM/YYYY", () => {
      expect(formatDate("2023-10-25")).toBe("25/10/2023");
    });

    it("deve retornar 'Data desconhecida' se a data for vazia ou nula", () => {
      expect(formatDate("")).toBe("Data desconhecida");
      expect(formatDate(null)).toBe("Data desconhecida");
    });
  });

  describe("formatRuntime", () => {
    it("deve formatar minutos para Xh Ym corretamente", () => {
      expect(formatRuntime(142)).toBe("2h 22m");
      expect(formatRuntime(60)).toBe("1h 0m");
      expect(formatRuntime(45)).toBe("0h 45m");
    });

    it("deve retornar 'Duração indisponível' para valores inválidos ou zero", () => {
      expect(formatRuntime(0)).toBe("Duração indisponível");
      expect(formatRuntime(null)).toBe("Duração indisponível");
    });
  });
});