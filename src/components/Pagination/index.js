/*
 * Pagination · navegação entre páginas com janela deslizante de números.
 * Acessível: aria-current na página atual e rótulo em todos os botões.
 */
import React from "react";
import "./styles.css";

/* Calcula a janela de até maxVisible páginas centrada na página atual. O(maxVisible). */
export function getPageWindow(currentPage, totalPages, maxVisible) {
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  const pages = [];
  for (let page = start; page <= end; page++) pages.push(page);
  return pages;
}

/* Renderiza os controles; não aparece quando existe uma única página. */
function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  maxVisible = 5,
  showFirstLast = true,
  showPrevNext = true,
  showPageNumbers = true,
  variant = "purple",
}) {
  if (totalPages <= 1) return null;

  const pages = getPageWindow(currentPage, totalPages, maxVisible);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <nav className={`pagination-container variant-${variant}`} aria-label="Paginação">
      {showFirstLast && (
        <button
          type="button"
          className="page-btn nav-btn"
          disabled={isFirst}
          onClick={() => onPageChange(1)}
          aria-label="Primeira página"
        >
          <span aria-hidden="true">&#10094;&#10094;</span>
        </button>
      )}
      {showPrevNext && (
        <button
          type="button"
          className="page-btn nav-btn"
          disabled={isFirst}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Página anterior"
        >
          <span aria-hidden="true">&#10094;</span>
        </button>
      )}
      {showPageNumbers &&
        pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`page-btn number-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => onPageChange(page)}
            aria-label={`Página ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      {showPrevNext && (
        <button
          type="button"
          className="page-btn nav-btn"
          disabled={isLast}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Próxima página"
        >
          <span aria-hidden="true">&#10095;</span>
        </button>
      )}
      {showFirstLast && (
        <button
          type="button"
          className="page-btn nav-btn"
          disabled={isLast}
          onClick={() => onPageChange(totalPages)}
          aria-label="Última página"
        >
          <span aria-hidden="true">&#10095;&#10095;</span>
        </button>
      )}
    </nav>
  );
}

export default Pagination;
/* fim de Pagination */
