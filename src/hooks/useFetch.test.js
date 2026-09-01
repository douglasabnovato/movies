import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useFetch } from "./useFetch";

describe("Hooks / useFetch", () => {
  let consoleSpy;

  beforeAll(() => {
    // Intercepta e ignora o aviso de deprecacao especifico do ReactDOMTestUtils.act
    consoleSpy = jest.spyOn(console, "error").mockImplementation((msg, ...args) => {
      if (typeof msg === "string" && msg.includes("ReactDOMTestUtils.act")) {
        return;
      }
      console.error(msg, ...args);
    });
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it("deve gerenciar estados de loading e data com sucesso", async () => {
    const mockAsyncFn = jest.fn().mockResolvedValue({ results: [1, 2, 3] });
    const { result } = renderHook(() => useFetch(mockAsyncFn));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({ results: [1, 2, 3] });
    expect(result.current.error).toBeNull();
  });

  it("deve tratar erros quando a requisição falha", async () => {
    const mockAsyncFn = jest.fn().mockRejectedValue(new Error("Erro de conexão"));
    const { result } = renderHook(() => useFetch(mockAsyncFn));

    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // Erro esperado
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Erro de conexão");
  });
});