/* Retrato da Home no build (#89): o servidor de teste não grava retrato, então o teste o injeta no HTML. */
const { test, expect } = require("@playwright/test");
const { mockTmdb } = require("./tmdb");
const { injetarRetrato } = require("../../scripts/home-snapshot-lib");

/* PNG de 1 × 1 px: basta para o navegador carregar o pôster. */
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64",
);
const HORA = 60 * 60 * 1000;
const filme = (id, title, poster_path) => ({ id, title, original_title: title, poster_path, release_date: "2020-01-02" });
const RETRATO = { page: 1, total_pages: 3, total_results: 60, results: [filme(10, "Filme do Retrato", "/velho.jpg")] };

async function prepararRetrato(page, { idadeMs, popular }) {
  await mockTmdb(page);
  if (popular !== undefined) {
    await page.route("https://api.themoviedb.org/3/movie/popular**", (route) =>
      popular ? route.fulfill({ json: popular }) : route.fulfill({ status: 500, json: {} }),
    );
  }
  await page.route("https://image.tmdb.org/**", (route) => route.fulfill({ body: PNG, contentType: "image/png" }));
  /* Só o documento da Home, no servidor local do teste. */
  await page.route((url) => url.hostname === "127.0.0.1" && url.pathname === "/", async (route) => {
    const resposta = await route.fetch();
    const html = injetarRetrato(await resposta.text(), RETRATO, new Date(Date.now() - idadeMs).toISOString());
    return route.fulfill({ response: resposta, body: html });
  });
  /* Guarda cada pôster que passou pelo esqueleto, antes de o React trocá-lo. */
  await page.addInitScript(() => {
    window.__posteres = [];
    window.__blocoCinza = false;
    window.__velhoVisivel = false;
    new MutationObserver(() => {
      const img = document.querySelector("#shell-first img");
      if (img && window.__posteres[window.__posteres.length - 1] !== img.src) window.__posteres.push(img.src);
      if (img && /velho\.jpg$/.test(img.src) && getComputedStyle(img).visibility !== "hidden") window.__velhoVisivel = true;
      if (document.querySelector("#shell-first .skeleton-poster")) window.__blocoCinza = true;
    }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ["src"] });
  });
}

test("com retrato vencido, o esqueleto troca o pôster pelo da lista nova", async ({ page }) => {
  const popular = { page: 1, total_pages: 3, results: [filme(20, "Filme Novo", "/novo.jpg")] };
  await prepararRetrato(page, { idadeMs: 72 * HORA, popular });
  await page.goto("/");
  await expect(page.getByText("Filme Novo")).toBeVisible();
  const posteres = await page.evaluate(() => window.__posteres);
  expect(posteres[posteres.length - 1]).toMatch(/\/novo\.jpg$/);
  expect(await page.evaluate(() => window.__velhoVisivel)).toBe(false);
  await expect(page.getByText("Filme do Retrato")).toHaveCount(0);
});

test("com retrato vencido e a API fora, o esqueleto volta ao bloco cinza", async ({ page }) => {
  await prepararRetrato(page, { idadeMs: 72 * HORA, popular: null });
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => window.__blocoCinza)).toBe(true);
  await expect(page.locator("#app-shell")).toHaveCount(0);
});
