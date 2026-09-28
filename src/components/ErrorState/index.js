/*
 * ErrorState · mensagem de erro com ação de recuperação (heurística 9 de Nielsen).
 */
import React from "react";
import "./styles.css";

/* Mostra título, detalhe e, quando houver onRetry, o botão "Tentar novamente". */
function ErrorState({ title, message, onRetry, children }) {
  return (
    <div className="error-state" role="alert">
      <p className="error-state-title">{title}</p>
      {message && <p className="error-state-message">{message}</p>}
      {onRetry && (
        <button type="button" className="error-state-button" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
      {children}
    </div>
  );
}

export default ErrorState;
/* fim de ErrorState */
