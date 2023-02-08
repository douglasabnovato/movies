import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const filters_name = [
  { name: "Ação" },
  { name: "Aventura" },
  { name: "Animação" },
  { name: "Comédia" },
  { name: "Crime" },
  { name: "Documentário" },
  { name: "Drama" },
  { name: "Família" },
  { name: "Fantasia" },
  { name: "História" },
  { name: "Terror" },
  { name: "Música" },
  { name: "Mistério" },
  { name: "Romance" },
  { name: "Ficção científica" },
  { name: "Cinema TV" },
  { name: "Thriller" },
  { name: "Guerra" },
  { name: "Faroeste" }
];

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
        console.log("home", data)
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
              {filters_name.map((filter) => {
                return (
                  <div key={filter.name}  className="filter-tag">
                    <h1>{filter.name}</h1>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="films">
        {movies.map((movie) => {
          return (
            <div key={movie.id} className="film">
              <Link to={`/movie/${movie.id}`}>
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
