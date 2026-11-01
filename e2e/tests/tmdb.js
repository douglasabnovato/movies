/* Simula a TMDB: nenhuma requisição sai para a API real, e qualquer rota nova falha o teste. */
const GENRES = [
  { id: 28, name: "Ação" },
  { id: 35, name: "Comédia" },
];
const movie = (id, title) => ({
  id,
  title,
  original_title: title,
  poster_path: null,
  release_date: "2020-01-02",
});
const POPULAR = [movie(1, "Filme Popular"), movie(2, "Outro Popular")];
const ACTION = [movie(3, "Filme de Ação")];
const FOUND = [movie(4, "Filme Buscado")];

function detail(id) {
  return {
    ...movie(id, `Detalhe ${id}`),
    overview: "Sinopse simulada.",
    vote_average: 7.5,
    runtime: 120,
    genres: GENRES.slice(0, 1),
    credits: { cast: [], crew: [] },
    videos: { results: [] },
    recommendations: { results: [] },
  };
}

function respond(url) {
  const path = url.pathname.replace("/3", "");
  const page = (results) => ({ results, total_pages: 3, page: Number(url.searchParams.get("page") || 1) });
  if (path === "/genre/movie/list") return { genres: GENRES };
  if (path === "/movie/popular") return page(POPULAR);
  if (path === "/discover/movie") return page(ACTION);
  if (path === "/search/movie") return page(FOUND);
  const match = path.match(/^\/movie\/(\d+)$/);
  if (match) return detail(Number(match[1]));
  return null;
}

async function mockTmdb(page) {
  await page.route("https://api.themoviedb.org/**", (route) => {
    const body = respond(new URL(route.request().url()));
    return body
      ? route.fulfill({ json: body })
      : route.fulfill({ status: 500, json: { status_message: "rota não simulada" } });
  });
  await page.route("https://image.tmdb.org/**", (route) => route.abort());
  await page.route("https://fonts.*/**", (route) => route.abort());
}

module.exports = { mockTmdb };
