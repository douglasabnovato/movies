/*
 * Depois do build, grava no index.html a primeira página de populares e o primeiro pôster.
 * Assim o navegador acha a imagem principal (LCP) no próprio HTML, sem esperar a chamada à API.
 * Sem chave real ou com a TMDB fora do ar, o build segue sem retrato, e a Home busca a lista ao abrir.
 */
const fs = require("fs");
const path = require("path");
const { injetarRetrato } = require("./home-snapshot-lib");

const CHAVE_DE_TESTE = "e2e-sem-api-real";

async function main() {
  const key = process.env.REACT_APP_TMDB_KEY;
  if (!key || key === CHAVE_DE_TESTE) {
    console.log("home-snapshot: sem chave real, build sem retrato da Home");
    return;
  }
  const page = path.join(__dirname, "..", "build", "index.html");
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=pt-BR&page=1`,
    );
    if (!response.ok) throw new Error(`TMDB respondeu ${response.status}`);
    const data = await response.json();
    const html = fs.readFileSync(page, "utf8");
    fs.writeFileSync(page, injetarRetrato(html, data, new Date().toISOString()));
    console.log(`home-snapshot: retrato gravado com ${data.results.length} filmes`);
  } catch (error) {
    console.warn(`home-snapshot: retrato não gravado (${error.message}); a Home busca ao abrir`);
  }
}

main();
/* fim de home-snapshot.js */
