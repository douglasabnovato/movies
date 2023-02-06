import React, { useState, useMemo } from 'react';
import Pagination from './Pagination';

import data from "./mock-data.json";

import "./app.css";

import MovFinch from "./films/finch.png";
import MovVenom from "./films/venom.png";
import MovSpiderMan from "./films/spider-man.png";
import MovTheWitcher from "./films/the-witcher.png";
import MovDeadpool from "./films/deadpool.png";

let PageSize = 10;

function TabelaDados() {
  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return data.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>FIRST NAME</th>
            <th>LAST NAME</th>
            <th>EMAIL</th>
            <th>PHONE</th>
          </tr>
        </thead>
        <tbody>
          {currentTableData.map((item) => {
            return (
              <tr>
                <td>{item.id}</td>
                <td>{item.first_name}</td>
                <td>{item.last_name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={data.length}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}

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
          <div className="card">
            <img src={MovFinch}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovVenom}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovSpiderMan}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovTheWitcher}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovDeadpool}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovFinch}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovVenom}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovSpiderMan}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovTheWitcher}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovDeadpool}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovFinch}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovVenom}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovSpiderMan}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovTheWitcher}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovDeadpool}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovFinch}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovVenom}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovSpiderMan}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovTheWitcher}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>

        <div className="film">
          <div className="card">
            <img src={MovDeadpool}></img>
            <div className="title-movie">Deadpool</div>
            <div className="title-date">12 NOV 2021</div>
          </div>
        </div>
      </div>

      <div className="pagination">
        <div className="contagem">1 2 3 4 5 > Última</div>
        <TabelaDados />
      </div>
    </div>
  );
}

export default App;
