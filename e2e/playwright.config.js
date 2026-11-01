/* Testa o build de produção servido na raiz; a TMDB é sempre simulada em tests/tmdb.js. */
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "npx serve -l 4173 ../build",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
});
