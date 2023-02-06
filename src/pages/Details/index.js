import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./styles.css";

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
        const { title, poster_path, overview, release_date } = data;
        const movie = {
          id,
          title: title,
          sinopse: overview,
          image: `${image_path}${poster_path}`,
          releaseDate: release_date,
        };
        setMovie(movie);
      });
  }, []);

  return (
    <div className="main">
      <p>id: {movie.id}</p>
      <p>title: {movie.title}</p>
      <p>sinopse: {movie.sinopse}</p>
      <p>image: {movie.image}</p>
      <p>releaseDate: {movie.releaseDate}</p>
      <p>
        <Link to="/">
          <button>Go Back</button>
        </Link>
      </p>
    </div>
  );
}

export default Details;
