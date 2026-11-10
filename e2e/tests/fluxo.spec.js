const { test, expect } = require("@playwright/test");
const { mockTmdb } = require("./tmdb");

test.beforeEach(async ({ page }) => {
  await mockTmdb(page);
});

test("filtra por gênero, abre o detalhe e volta com o filtro", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Filme Popular")).toBeVisible();

  await page.getByRole("button", { name: "Ação" }).click();
  await expect(page.getByText("Filme de Ação")).toBeVisible();
  await expect(page).toHaveURL(/genres=28/);

  await page.getByRole("link", { name: "Ver detalhes do filme Filme de Ação" }).click();
  await expect(page.getByRole("heading", { name: "Detalhe 3" })).toBeVisible();

  await page.getByRole("link", { name: "Voltar para a lista de filmes", exact: true }).click();
  await expect(page).toHaveURL(/genres=28/);
  await expect(page.getByText("Filme de Ação")).toBeVisible();
  await expect(page.getByRole("button", { name: "Ação" })).toHaveAttribute("aria-pressed", "true");
});

test("busca pelo nome e atualiza a URL", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Buscar filme pelo nome").fill("buscado");
  await expect(page.getByText("Filme Buscado")).toBeVisible();
  await expect(page).toHaveURL(/search=buscado/);
});

test("conclui o fluxo só com o teclado, com o foco visível", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Filme Popular")).toBeVisible();

  const outlineOf = (locator) =>
    locator.evaluate((el) => {
      const style = getComputedStyle(el);
      return style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
    });

  const search = page.getByLabel("Buscar filme pelo nome");
  const genre = page.getByRole("button", { name: "Ação" });
  const card = page.getByRole("link", { name: "Ver detalhes do filme Filme de Ação" });

  await page.keyboard.press("Tab");
  await expect(search).toBeFocused();
  expect(await outlineOf(search)).toBe(true);

  await page.keyboard.press("Tab");
  await expect(genre).toBeFocused();
  expect(await outlineOf(genre)).toBe(true);
  await page.keyboard.press("Enter");
  await expect(page.getByText("Filme de Ação")).toBeVisible();

  await card.focus();
  expect(await outlineOf(card)).toBe(true);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Detalhe 3" })).toBeVisible();

  const back = page.getByRole("link", { name: "Voltar para a lista de filmes", exact: true });
  await back.focus();
  expect(await outlineOf(back)).toBe(true);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/genres=28/);
});

test("não há rolagem horizontal nas larguras de referência", async ({ page }) => {
  for (const width of [320, 375, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await expect(page.getByText("Filme Popular")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `largura ${width}`).toBeLessThanOrEqual(0);
  }
});

test("respeita a preferência por menos movimento", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const genre = page.getByRole("button", { name: "Ação" });
  await expect(genre).toHaveCSS("transition-duration", "0s");
  const animation = await page.evaluate(() => {
    const element = document.createElement("div");
    element.className = "pulse";
    document.body.appendChild(element);
    return getComputedStyle(element).animationName;
  });
  expect(animation).toBe("none");
});

test("o GoatCounter não carrega nos testes nem em localhost", async ({ page }) => {
  const pedidos = [];
  page.on("request", (r) => pedidos.push(r.url()));
  await page.goto("/");
  await page.getByRole("link", { name: "Ver detalhes do filme Filme Popular" }).click();
  await expect(page.getByRole("heading", { name: "Detalhe 1" })).toBeVisible();
  await expect(page.locator("script[data-goatcounter]")).toHaveCount(0);
  expect(pedidos.filter((u) => /goatcounter|gc\.zgo\.at/.test(u))).toEqual([]);
});

test("no site publicado, abrir um filme conta a rota e o evento abriu-filme", async ({ page }) => {
  // Simula o navegador de um visitante: sem a marca de automação e fora de localhost.
  await page.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => false }));
  await page.route("https://douglasabnovato.github.io/**", async (route) => {
    const caminho = new URL(route.request().url()).pathname.replace(/^\/movies/, "") || "/";
    const local = await page.request.get(caminho);
    await route.fulfill({ response: local });
  });
  // Um GoatCounter falso guarda as contagens para o teste conferir.
  await page.route("https://gc.zgo.at/**", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: "window.contagens = []; window.goatcounter = { count: (v) => window.contagens.push(v) };",
    })
  );
  await page.goto("https://douglasabnovato.github.io/movies/");
  await expect(page.locator("script[data-goatcounter]")).toHaveAttribute(
    "data-goatcounter",
    "https://douglasabnovato.goatcounter.com/count"
  );
  await page.getByRole("link", { name: "Ver detalhes do filme Filme Popular" }).click();
  await expect(page.getByRole("heading", { name: "Detalhe 1" })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.contagens || []))
    .toContainEqual({ path: "abriu-filme", title: "abriu-filme", event: true });
});
