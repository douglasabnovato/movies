import React from "react";
import "./styles.css";

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

    // Lógica para calcular a janela de páginas numéricas visíveis
    const getPageNumbers = () => {
        const half = Math.floor(maxVisible / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <nav className={`pagination-container variant-${variant}`} aria-label="Navegação de Páginas">
            {/* Botão Primeira Página */}
            {showFirstLast && (
                <button
                    type="button"
                    className="page-btn nav-btn"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(1)}
                    title="Primeira Página"
                >
                    &#10094;&#10094;
                </button>
            )}

            {/* Botão Anterior */}
            {showPrevNext && (
                <button
                    type="button"
                    className="page-btn nav-btn"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    title="Página Anterior"
                >
                    &#10094;
                </button>
            )}

            {/* Números das Páginas */}
            {showPageNumbers &&
                pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        className={`page-btn number-btn ${currentPage === page ? "active" : ""}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

            {/* Botão Próximo */}
            {showPrevNext && (
                <button
                    type="button"
                    className="page-btn nav-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    title="Próxima Página"
                >
                    &#10095;
                </button>
            )}

            {/* Botão Última Página */}
            {showFirstLast && (
                <button
                    type="button"
                    className="page-btn nav-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(totalPages)}
                    title="Última Página"
                >
                    &#10095;&#10095;
                </button>
            )}
        </nav>
    );
}

export default Pagination;