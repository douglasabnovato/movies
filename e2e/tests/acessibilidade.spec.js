/* Verificação automática de acessibilidade (WCAG A e AA) nas telas do fluxo principal; não substitui o teste com leitor de tela */
const { test, expect } = require("@playwright/test");
const { AxeBuilder } = require("@axe-core/playwright");
const { mockTmdb } = require("./tmdb");

const NORMAS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

const violacoes = async (page) => {
  const { violations } = await new AxeBuilder({ page }).withTags(NORMAS).analyze();
  return violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
};

test.beforeEach(async ({ page }) => {
  await mockTmdb(page);
});

test("a página inicial não tem violações", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Filme Popular")).toBeVisible();
  expect(await violacoes(page)).toEqual([]);
});

test("a lista filtrada não tem violações", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ação" }).click();
  await expect(page.getByText("Filme de Ação")).toBeVisible();
  expect(await violacoes(page)).toEqual([]);
});

test("o detalhe do filme não tem violações", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ação" }).click();
  await page.getByRole("link", { name: "Ver detalhes do filme Filme de Ação" }).click();
  await expect(page.getByRole("heading", { name: "Detalhe 3" })).toBeVisible();
  expect(await violacoes(page)).toEqual([]);
});
