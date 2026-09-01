import { useState, useCallback } from "react";

/**
 * Hook customizado para gerenciamento de estados de requisições assíncronas (loading, error, data).
 * @param {Function} asyncFunction - Função assíncrona a ser executada (ex: tmdbService.getPopularMovies)
 * @returns {Object} { data, loading, error, execute }
 */
export function useFetch(asyncFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...params) => {
      setLoading(true);
      setError(null);
      try {
        const response = await asyncFunction(...params);
        setData(response);
        return response;
      } catch (err) {
        setError(err.message || "Erro ao carregar dados.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  return { data, loading, error, execute };
}