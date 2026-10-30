/*
 * NotFound · página para endereços que não correspondem a nenhuma rota.
 */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ErrorState from "../../components/ErrorState";

/* Explica o problema e leva de volta à listagem. */
function NotFound() {
  useEffect(() => {
    document.title = "Página não encontrada · Movie's";
  }, []);

  return (
    <main className="main">
      <ErrorState title="Página não encontrada" message="O endereço pode estar errado.">
        <Link to="/" className="error-state-link">
          Voltar para a lista
        </Link>
      </ErrorState>
    </main>
  );
}

export default NotFound;
/* fim de NotFound */
