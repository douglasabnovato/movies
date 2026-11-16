/* Testa o build de produção servido na raiz; a TMDB é sempre simulada em tests/tmdb.js. */
const { defineConfig, devices } = require("@playwright/test");

/* Porta própria por E2E_PORT, para não testar o servidor de outro processo na mesma máquina. */
const PORT = process.env.E2E_PORT || "4173";

module.exports = defineConfig({
  testDir: "./tests",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: `npx serve -l ${PORT} ../build`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
