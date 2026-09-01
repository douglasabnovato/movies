import React from "react";
import "./styles.css";

function Footer() {
  return (
    <footer className="footer" aria-label="Rodapé do site">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-title">TMDB Explorer</span>
          <p className="footer-description">
            Dados fornecidos pela API do The Movie Database (TMDB).
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