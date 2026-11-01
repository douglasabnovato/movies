import React from "react";
import "./styles.css";

/* Logo oficial, exigido pelo item 3 dos termos da API da TMDB, com o aviso em inglês abaixo dele. */
const TMDB_LOGO_URL =
  "https://www.themoviedb.org/assets/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg";

function Footer() {
  return (
    <footer className="footer" aria-label="Rodapé do site">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-title">Movies</span>
          <p className="footer-description">
            Dados fornecidos pela API do The Movie Database (TMDB).
          </p>
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="footer-tmdb-logo">
            <img src={TMDB_LOGO_URL} alt="TMDB" width="78" height="10" loading="lazy" />
          </a>
          <p className="footer-description" lang="en">
            This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.
          </p>
        </div>
        <div className="footer-credits">
          <p>
            Desenvolvido por{" "}
            <a
              href="https://github.com/douglasabnovato"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Douglas A B Novato
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;