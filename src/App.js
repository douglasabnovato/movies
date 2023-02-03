import "./app.css";

function App() {
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

        <div className="film">
          <div>
            <h1>Ação</h1>
            <h1>Ação</h1>
            <h1>Ação</h1>
            <h1>Ação</h1>
          </div> 
        </div>

      </div>

    </div>
  );
}

export default App;
