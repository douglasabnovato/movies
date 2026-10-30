/*
 * ErrorBoundary · impede que um erro de renderização apague a aplicação inteira.
 */
import React from "react";
import ErrorState from "../ErrorState";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  /* Troca a árvore que falhou pela mensagem de erro. */
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  /* Registra a causa no console para diagnóstico. */
  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }

  /* Recarrega a página, voltando a um estado limpo. */
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="main">
        <ErrorState title="Algo deu errado" message="Recarregue a página para continuar.">
          <button type="button" className="error-state-button" onClick={this.handleReload}>
            Recarregar
          </button>
        </ErrorState>
      </main>
    );
  }
}

export default ErrorBoundary;
/* fim de ErrorBoundary */
