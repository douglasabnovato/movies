/*
 * useFetch.js · hook que carrega um recurso assíncrono, cancela a requisição
 * anterior quando as dependências mudam e expõe retry para o estado de erro.
 */
import { useState, useEffect, useCallback, useRef } from "react";

/*
 * Executa loader({ signal }) sempre que deps mudam.
 * Retorna { data, loading, error, retry }; erros de cancelamento são ignorados.
 */
export function useFetch(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ data: previous.data, loading: true, error: null }));

    loaderRef
      .current({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (controller.signal.aborted || (error && error.kind === "aborted")) return;
        setState({ data: null, loading: false, error });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { ...state, retry };
}
/* fim de useFetch.js */
