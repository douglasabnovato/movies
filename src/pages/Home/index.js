import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"; 
import "./styles.css"; 

function App() {
  const API_KEY = "0e3950318bf412e11272f2f58c14e062";
  const [movies, setMovies] = useState([]);
  const [pages, setPages] = useState([]);
  const [imagePath, setImagePath] = useState(`https://image.tmdb.org/t/p/w500`);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pages}`
    )
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results);
        setPages(data.pages);
      });
  }, []);

  return (
    <div className="main">
      <div className="top">
        <div className="navbar">
          <div className="title-site">
            <div className="title-text">
              TMDB
              <span className="title-obj"></span>
            </div>
          </div>
        </div>

        <div className="slogan">
          <div className="slogan-text">
            Milhões de filmes, séries e pessoas para descobrir. Explore já.
          </div>
        </div>

        <div className="filter">
          <div className="filter-container">
            <div className="filter-text">FILTER POR:</div>

            <div className="filter-box">
              <div className="filter-tag">
                <h1>Ação</h1>
              </div>
              <div className="filter-tag">
                <h1>Aventura</h1>
              </div>
              <div className="filter-tag">
                <h1>Animação</h1>
              </div>
              <div className="filter-tag">
                <h1>Comédia</h1>
              </div>
              <div className="filter-tag">
                <h1>Crime</h1>
              </div>
              <div className="filter-tag">
                <h1>Documentário</h1>
              </div>
              <div className="filter-tag">
                <h1>Drama</h1>
              </div>
              <div className="filter-tag">
                <h1>Família</h1>
              </div>
              <div className="filter-tag">
                <h1>Fantasia</h1>
              </div>
              <div className="filter-tag">
                <h1>História</h1>
              </div>

              <div className="filter-tag">
                <h1>Terror</h1>
              </div>
              <div className="filter-tag">
                <h1>Música</h1>
              </div>
              <div className="filter-tag">
                <h1>Mistério</h1>
              </div>
              <div className="filter-tag">
                <h1>Romance</h1>
              </div>
              <div className="filter-tag">
                <h1>Ficção científica</h1>
              </div>
              <div className="filter-tag">
                <h1>Cinema TV</h1>
              </div>
              <div className="filter-tag">
                <h1>Thriller</h1>
              </div>
              <div className="filter-tag">
                <h1>Guerra</h1>
              </div>
              <div className="filter-tag">
                <h1>Faroeste</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="films">
        {movies.map((movie) => {
          return (
            <div key={movie.id} className="film">
              <Link to={`/details/${movie.id}`}>
                <div className="card">
                  <img src={`${imagePath}${movie.poster_path}`}></img>
                  <div className="title-movie">{movie.original_title}</div>
                  <div className="title-date">{movie.release_date}</div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="pagination">
        <div className="contagem">
          <span className="numeros"> 1 2 3 4 5 </span>
          <span className="seta"> &gt; </span>
          <span className="posicao">Última</span>
        </div>
      </div>
    </div>
  );
}

export default App;
