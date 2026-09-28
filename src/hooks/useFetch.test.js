/* useFetch.test.js · carregamento, erro, retry e cancelamento do hook. */
import { renderHook, waitFor, act } from "@testing-library/react";
import { useFetch } from "./useFetch";

describe("Hooks / useFetch", () => {
  it("começa carregando e entrega os dados", async () => {
    const loader = jest.fn().mockResolvedValue({ results: [1, 2, 3] });
    const { result } = renderHook(() => useFetch(loader, []));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ results: [1, 2, 3] });
    expect(result.current.error).toBeNull();
    expect(loader.mock.calls[0][0].signal).toBeInstanceOf(AbortSignal);
  });

  it("expõe o erro e recarrega com retry", async () => {
    const loader = jest
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error("Sem conexão"), { kind: "network" }))
      .mockResolvedValueOnce("ok");
    const { result } = renderHook(() => useFetch(loader, []));
    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error.kind).toBe("network");

    act(() => result.current.retry());
    await waitFor(() => expect(result.current.data).toBe("ok"));
    expect(result.current.error).toBeNull();
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it("ignora a resposta antiga quando as dependências mudam (sem condição de corrida)", async () => {
    const resolvers = {};
    const loader = (term) => () => new Promise((resolve) => { resolvers[term] = resolve; });
    const { result, rerender } = renderHook(({ term }) => useFetch(loader(term), [term]), {
      initialProps: { term: "ma" },
    });
    rerender({ term: "matrix" });

    await act(async () => {
      resolvers.matrix("resultado de matrix");
    });
    await act(async () => {
      resolvers.ma("resultado de ma");
    });

    expect(result.current.data).toBe("resultado de matrix");
  });

  it("aborta a requisição pendente ao desmontar", () => {
    let receivedSignal;
    const loader = ({ signal }) => {
      receivedSignal = signal;
      return new Promise(() => {});
    };
    const { unmount } = renderHook(() => useFetch(loader, []));
    unmount();
    expect(receivedSignal.aborted).toBe(true);
  });
});
/* fim de useFetch.test.js */
