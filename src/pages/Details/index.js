import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./styles.css";
import image20 from "../../assets/image20.png";
import image28 from "../../assets/image28.png";
import image37 from "../../assets/image37.png";

function loader(rating) {
  let circularProgress = document.querySelector(".circular-progress"),
    progressValue = document.querySelector(".progress-value");

  let progressStartValue = 0,
    progressEndValue = rating,
    speed = 100;

  let progress = setInterval(() => {
    progressStartValue++;

    progressValue.textContent = `${progressStartValue}%`;
    circularProgress.style.background = `conic-gradient(#14ff00 ${
      progressStartValue * 3.6
    }deg, rgba(255, 255, 255, 0.1) 0deg)`;

    if (progressStartValue == progressEndValue) {
      clearInterval(progress);
    }
  }, speed);
}

function Details() {
  const API_KEY = "0e3950318bf412e11272f2f58c14e062";
  const { id } = useParams();
  const [movie, setMovie] = useState({});
  const image_path = `https://image.tmdb.org/t/p/w500`;
  const [pages, setPages] = useState(1);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US&page=1`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const { title, poster_path, overview, release_date, genres, runtime } =
          data;
        const movie = {
          id,
          title: title,
          sinopse: overview,
          image: `${image_path}${poster_path}`,
          releaseDate: release_date,
          genres: genres,
          runtime: runtime,
        };
        setMovie(movie);
      });
    loader(74);
  }, []);

  return (
    <div className="main">
      <div className="top">
        <div className="navbar">
          <div className="title-site">
            <Link to="/" className="title-text">
              TMDB
              <span className="title-obj"></span>
            </Link>
          </div>
        </div>

        <div className="film-detail">
          <div className="film-banner">
            <img src={movie.image}></img>
          </div>

          <div className="film-infos">
            <div className="info-title">
              <p className="title-name">{movie.title}</p>
              <p className="title-head">
                16 anos • {movie.releaseDate} (BR) • Ação, Aventura, Comédia,
                Ficção científica • {movie.runtime}min
              </p>
            </div>

            <div className="info-evaluation">
              <div className="evaluation-loading">
                <div class="circular-progress">
                  <span class="progress-value">0%</span>
                </div>
              </div>

              <p className="evaluation-evaluation">Avaliação dos usuários</p>
            </div>
            <div className="info-sinopse">
              <p className="sinopse-title">Sinopse</p>
              <p className="sinopse-text">{movie.sinopse}</p>
            </div>
            <div className="info-datasheet">
              <div className="datasheet-1">
                <p className="datasheet-title">Rob Liefeld</p>
                <p className="datasheet-text">Characters</p>
              </div>
              <div className="datasheet-1">
                <p className="datasheet-title">Rhett Reese</p>
                <p className="datasheet-text">Screenplay</p>
              </div>
              <div className="datasheet-1">
                <p className="datasheet-title">Fabian Nicieza</p>
                <p className="datasheet-text">Characters</p>
              </div>
              <div className="datasheet-1">
                <p className="datasheet-title">Paul Wernick</p>
                <p className="datasheet-text">Screenplay</p>
              </div>
              <div className="datasheet-1">
                <p className="datasheet-title">Tim Miller</p>
                <p className="datasheet-text">Director</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="casts">
        <div className="title-casts">Elenco Original</div>
        <div className="list-casts">
          <div className="item-cast">
            <img src={image28}></img>
            <div className="details-cast">
              <div className="name-cast">Ryan Reynolds</div>
              <div className="paper-cast">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image28}></img>
            <div className="details-cast">
              <div className="name-cast">Ryan Reynolds</div>
              <div className="paper-cast">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image28}></img>
            <div className="details-cast">
              <div className="name-cast">Ryan Reynolds</div>
              <div className="paper-cast">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image28}></img>
            <div className="details-cast">
              <div className="name-cast">Ryan Reynolds</div>
              <div className="paper-cast">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image28}></img>
            <div className="details-cast">
              <div className="name-cast">Ryan Reynolds</div>
              <div className="paper-cast">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image28}></img>
            <div className="details-cast">
              <div className="name-cast">Ryan Reynolds</div>
              <div className="paper-cast">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image28}></img>
            <div className="details-cast">
              <div className="name-cast">Ryan Reynolds</div>
              <div className="paper-cast">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image28}></img>
            <div className="details-cast">
              <div className="name-cast">Ryan Reynolds</div>
              <div className="paper-cast">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image28}></img>
            <div className="details-cast">
              <div className="name-cast">Ryan Reynolds</div>
              <div className="paper-cast">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image28}></img>
            <div className="details-cast">
              <div className="name-cast">Ryan Reynolds</div>
              <div className="paper-cast">Wade Wilson / Deadpool</div>
            </div>
          </div>
        </div>
      </div>

      <div className="trailer">
        <div className="title-trailer">Trailer</div>
        <img src={image37}></img>
      </div>

      <div className="recommendations">
        <div className="title-recommendations">Recomendações</div>
        <div className="list-recommendations">
          <div className="item-recommendation">
            <img src={image20}></img>
            <div className="details-recommendation">
              <div className="name-recommendation">Ryan Reynolds</div>
              <div className="paper-recommendation">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-recommendation">
            <img src={image20}></img>
            <div className="details-recommendation">
              <div className="name-recommendation">Ryan Reynolds</div>
              <div className="paper-recommendation">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-recommendation">
            <img src={image20}></img>
            <div className="details-recommendation">
              <div className="name-recommendation">Ryan Reynolds</div>
              <div className="paper-recommendation">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-recommendation">
            <img src={image20}></img>
            <div className="details-recommendation">
              <div className="name-recommendation">Ryan Reynolds</div>
              <div className="paper-recommendation">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-recommendation">
            <img src={image20}></img>
            <div className="details-recommendation">
              <div className="name-recommendation">Ryan Reynolds</div>
              <div className="paper-recommendation">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-recommendation">
            <img src={image20}></img>
            <div className="details-recommendation">
              <div className="name-recommendation">Ryan Reynolds</div>
              <div className="paper-recommendation">Wade Wilson / Deadpool</div>
            </div>
          </div>
          <div className="item-recommendation">
            <img src={image20}></img>
            <div className="details-recommendation">
              <div className="name-recommendation">Ryan Reynolds</div>
              <div className="paper-recommendation">Wade Wilson / Deadpool</div>
            </div>
          </div>
        </div>
      </div>

      <Link to="/">
        <button>Go Back</button>
      </Link>
    </div>
  );
}

export default Details;
