/* Testes do retrato da Home (node --test) */
const test = require("node:test");
const assert = require("node:assert");
const {
  reduzirPopulares,
  injetarRetrato,
  adiarScriptPrincipal,
  SHELL_POSTER,
  POSTER_BASE,
  LIMITE_JS_MS,
} = require("./home-snapshot-lib");

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

const MAIN = '<script defer="defer" src="/movies/static/js/main.abc123.js"></script>';
const HTML_COM_JS = `<html><head><title>x</title>${MAIN}</head><body>${SHELL_POSTER}</div></body></html>`;

test("com pôster no esqueleto, o JavaScript só baixa depois dele", () => {
  const html = injetarRetrato(HTML_COM_JS, DATA, "agora");
  assert.ok(!html.includes(MAIN));
  assert.ok(html.includes('s.src="/movies/static/js/main.abc123.js"'));
  assert.ok(html.includes('img.addEventListener("load",carregar)'));
  assert.ok(html.includes(`setTimeout(carregar,${LIMITE_JS_MS})`));
});

test("sem pôster no primeiro filme, o JavaScript segue com defer", () => {
  const semPoster = { ...DATA, results: [DATA.results[1]] };
  assert.ok(injetarRetrato(HTML_COM_JS, semPoster, "agora").includes(MAIN));
});

test("o carregador baixa o JavaScript uma vez só", () => {
  const html = adiarScriptPrincipal(MAIN);
  const codigo = html.replace(/^<script>/, "").replace(/<\/script>$/, "");
  const criados = [];
  const ouvintes = {};
  const img = { complete: false, addEventListener: (tipo, fn) => (ouvintes[tipo] = fn) };
  const documento = {
    readyState: "interactive",
    documentElement: { className: "" },
    querySelector: () => img,
    createElement: () => ({}),
    head: { appendChild: (s) => criados.push(s.src) },
  };
  const temporizadores = [];
  new Function("document", "setTimeout", codigo)(documento, (fn) => temporizadores.push(fn));
  assert.deepStrictEqual(criados, []);
  ouvintes.load();
  temporizadores.forEach((fn) => fn());
  ouvintes.error();
  assert.deepStrictEqual(criados, ["/movies/static/js/main.abc123.js"]);
});

test("fora da Home sem filtros, o JavaScript baixa na hora", () => {
  const codigo = adiarScriptPrincipal(MAIN).replace(/^<script>/, "").replace(/<\/script>$/, "");
  const criados = [];
  const documento = {
    readyState: "interactive",
    documentElement: { className: "no-shell" },
    querySelector: () => ({ complete: false, addEventListener() {} }),
    createElement: () => ({}),
    head: { appendChild: (s) => criados.push(s.src) },
  };
  new Function("document", "setTimeout", codigo)(documento, () => {});
  assert.strictEqual(criados.length, 1);
});

test("acha o script principal também com o site na raiz (PUBLIC_URL=/)", () => {
  const html = adiarScriptPrincipal('<script defer="defer" src="/static/js/main.abc123.js"></script>');
  assert.ok(html.includes('s.src="/static/js/main.abc123.js"'));
});
