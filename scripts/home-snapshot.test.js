/* Testes do retrato da Home (node --test) */
const test = require("node:test");
const assert = require("node:assert");
const { reduzirPopulares, injetarRetrato, SHELL_POSTER, POSTER_BASE } = require("./home-snapshot-lib");

const HTML = `<html><head><title>x</title></head><body>${SHELL_POSTER}<div class="skeleton-title"></div></div></body></html>`;
const DATA = {
  page: 1,
  total_pages: 500,
  total_results: 10000,
  results: [
    { id: 1, title: "Um", original_title: "One", poster_path: "/a.jpg", release_date: "2026-01-01", overview: "longo" },
    { id: 2, title: "</script><b>", original_title: "Two", poster_path: null, release_date: "" },
  ],
};

test("guarda só os campos usados pela Home", () => {
  const reduzido = reduzirPopulares(DATA);
  assert.deepStrictEqual(Object.keys(reduzido.results[0]).sort(), [
    "id",
    "original_title",
    "poster_path",
    "release_date",
    "title",
  ]);
  assert.strictEqual(reduzido.total_pages, 500);
});

test("põe o pôster no esqueleto e o preload no head", () => {
  const html = injetarRetrato(HTML, DATA, "2026-11-05T00:00:00.000Z");
  assert.ok(html.includes(`<link rel="preload" as="image" href="${POSTER_BASE}/a.jpg" fetchpriority="high">`));
  assert.ok(html.includes(`<img src="${POSTER_BASE}/a.jpg"`));
  assert.ok(!html.includes(SHELL_POSTER));
  assert.ok(html.includes('"geradoEm":"2026-11-05T00:00:00.000Z"'));
});

test("um título com </script> não fecha a tag antes da hora", () => {
  const html = injetarRetrato(HTML, DATA, "agora");
  assert.strictEqual(html.match(/<\/script>/g).length, 1);
});

test("sem pôster no primeiro filme, grava só os dados", () => {
  const semPoster = { ...DATA, results: [DATA.results[1]] };
  const html = injetarRetrato(HTML, semPoster, "agora");
  assert.ok(html.includes("__moviesHomeSnapshot"));
  assert.ok(html.includes(SHELL_POSTER));
  assert.ok(!html.includes('rel="preload"'));
});

test("falha alto se o HTML não tiver <head>", () => {
  assert.throws(() => injetarRetrato("<html></html>", DATA, "agora"), /sem <head>/);
});

test("grava o retrato depois do <meta charset>", () => {
  const html = injetarRetrato('<html><head><meta charset="utf-8"/><title>x</title></head></html>', DATA, "agora");
  assert.ok(html.indexOf("charset") < html.indexOf("__moviesHomeSnapshot"));
});

test("pôster com caminho fora do formato da TMDB não entra no HTML", () => {
  const estranho = { ...DATA, results: [{ ...DATA.results[0], poster_path: '/a.jpg" onerror="x' }] };
  const html = injetarRetrato(HTML, estranho, "agora");
  assert.ok(!html.includes('rel="preload"'));
  assert.ok(html.includes(SHELL_POSTER));
});
