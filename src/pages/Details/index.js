import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./styles.css";
import image19 from "../../assets/image19.png";
import image20 from "../../assets/image20.png";
import image21 from "../../assets/image21.png";
import image22 from "../../assets/image22.png";
import image23 from "../../assets/image23.png";
import image24 from "../../assets/image24.png";
import image26 from "../../assets/image26.png";
import image28 from "../../assets/image28.png";
import image29 from "../../assets/image29.png";
import image30 from "../../assets/image30.png";
import image31 from "../../assets/image31.png";
import image32 from "../../assets/image32.png";
import image33 from "../../assets/image33.png";
import image35 from "../../assets/image35.png";
import image36 from "../../assets/image36.png";
import image37 from "../../assets/image37.png";

async function loader(rating) {
  let circularProgress = document.querySelector(".circular-progress"),
    progressValue = document.querySelector(".progress-value");

  let progressStartValue = 0,
    speed = 100;

  let progressEndValue = Math.round(rating * 10);

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
  const [genres, setGenres] = useState({});
  const image_path = `https://image.tmdb.org/t/p/w500`;
  const [pages, setPages] = useState(1);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US&page=1`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("details", data);

        const {
          title,
          poster_path,
          overview,
          release_date,
          genres,
          runtime,
          vote_average,
        } = data;

        const movie = {
          id,
          title: title,
          sinopse: overview,
          image: `${image_path}${poster_path}`,
          releaseDate: release_date,
          genres: genres,
          runtime: runtime,
          valuation: vote_average,
        };

        setMovie(movie);
        setGenres(movie.genres);
        loader(movie.valuation);
      });
  }, []);

  return (
    <div className="main">
      <div className="top">
        <div id="toper" className="navbar">
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
                16 anos • {movie.releaseDate} (BR) •
                {genres.length > 0 ? (
                  genres.map((genre) => {
                    return (
                      <span key={genre.id}>
                        {genre.name}
                        {"•"}
                      </span>
                    );
                  })
                ) : (
                  <span>Livre</span>
                )}
                {movie.runtime}min
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
            <img src={image29}></img>
            <div className="details-cast">
              <div className="name-cast">Morena Baccarin</div>
              <div className="paper-cast">Vanessa</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image30}></img>
            <div className="details-cast">
              <div className="name-cast">Ed Skrein</div>
              <div className="paper-cast">Ajax</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image31}></img>
            <div className="details-cast">
              <div className="name-cast">T. J. Miller</div>
              <div className="paper-cast">Weasel</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image32}></img>
            <div className="details-cast">
              <div className="name-cast">Gina Carano</div>
              <div className="paper-cast">Angel Dust</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image33}></img>
            <div className="details-cast">
              <div className="name-cast">Leslie Uggams</div>
              <div className="paper-cast">Blind Al</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image35}></img>
            <div className="details-cast">
              <div className="name-cast">Karan Soni</div>
              <div className="paper-cast">Dopinder</div>
            </div>
          </div>
          <div className="item-cast">
            <img src={image36}></img>
            <div className="details-cast">
              <div className="name-cast">Jed Rees</div>
              <div className="paper-cast">Recruiter</div>
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
            <img src={image19}></img>
            <div className="details-recommendation">
              <div className="name-recommendation">Clifford</div>
              <div className="paper-recommendation">12 NOV 2021</div>
            </div>
          </div>
          <div className="item-recommendation">
            <img src={image20}></img>
            <div className="details-recommendation">
              <div className="name-recommendation">7 Prisioneiros</div>
              <div className="paper-recommendation">22 JAN 2021</div>
            </div>
          </div>
          <div className="item-recommendation">
            <img src={image21}></img>
            <div className="details-recommendation">
              <div className="name-recommendation">Resident Evil</div>
              <div className="paper-recommendation">02 MAI 2021</div>
            </div>
          </div>
          <div className="item-recommendation">
            <img src={image22}></img>
            <div className="details-recommendation">
              <div className="name-recommendation">Ghostbusters</div>
              <div className="paper-recommendation">24 DEZ 2021</div>
            </div>
          </div>
          <div className="item-recommendation">
            <img src={image23}></img>
            <div className="details-recommendation">
              <div className="name-recommendation">A Protegida</div>
              <div className="paper-recommendation">19 FEV 2022</div>
            </div>
          </div>
          <div className="item-recommendation">
            <img src={image24}></img>
            <div className="details-recommendation">
              <div className="name-recommendation">Casa Gucci</div>
              <div className="paper-recommendation">27 SET 2020</div>
            </div>
          </div>
        </div>
      </div>

      <Link to="/" class="back-to"></Link>
    </div>
  );
}

export default Details;
