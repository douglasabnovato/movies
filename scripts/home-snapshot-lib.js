/* Funções puras do retrato da Home: reduzem a resposta da TMDB e a gravam no index.html do build */
const POSTER_BASE = "https://image.tmdb.org/t/p/w342";
const SHELL_POSTER = '<div class="film-skeleton" id="shell-first"><div class="skeleton-poster pulse"></div>';

/* Guarda só os campos que a Home usa, para o HTML crescer o mínimo. */
function reduzirPopulares(data) {
  return {
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
    results: (data.results || []).map((movie) => ({
      id: movie.id,
      title: movie.title,
      original_title: movie.original_title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    })),
  };
}

/* "<" vira < para o JSON não fechar a tag <script> antes da hora. */
function jsonSeguro(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/* Caminho de pôster da TMDB ("/abc123.jpg"); outro formato não entra num atributo do HTML. */
const POSTER_PATH = /^\/[\w.-]+$/;

/* Logo depois do <meta charset>: o navegador precisa achar a codificação nos primeiros 1024 bytes. */
const META_CHARSET = /<meta charset="?utf-8"?\s*\/?>/i;

/* Põe no HTML o retrato, o preload do primeiro pôster e o próprio pôster no esqueleto. */
function injetarRetrato(html, data, geradoEm) {
  const reduzido = reduzirPopulares(data);
  const primeiro = reduzido.results[0];
  const script = `<script>window.__moviesHomeSnapshot=${jsonSeguro({ geradoEm, data: reduzido })}</script>`;
  let saida = META_CHARSET.test(html)
    ? html.replace(META_CHARSET, (meta) => meta + script)
    : html.replace("<head>", `<head>${script}`);
  if (primeiro && POSTER_PATH.test(primeiro.poster_path || "") && saida.includes(SHELL_POSTER)) {
    const src = POSTER_BASE + primeiro.poster_path;
    const preload = `<link rel="preload" as="image" href="${src}" fetchpriority="high">`;
    const img =
      `<div class="film-skeleton" id="shell-first" style="width:100%">` +
      `<img src="${src}" alt="" width="176" height="264" fetchpriority="high" ` +
      `style="display:block;width:100%;height:auto;border-radius:8px">`;
    saida = saida.replace(script, script + preload).replace(SHELL_POSTER, img);
  }
  if (saida === html) throw new Error("index.html sem <head>: retrato não gravado");
  return saida;
}

module.exports = { reduzirPopulares, jsonSeguro, injetarRetrato, POSTER_BASE, SHELL_POSTER };
/* fim de home-snapshot-lib.js */
