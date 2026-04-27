/* Playwright config · smoke tests Waimia
 * Cf docs/06-coding-standards.md §14 (testing strategy)
 *
 * Lance Astro dev en preview avant les tests.
 * `pnpm test:e2e` pour exécuter localement, ou en CI Vercel/GitHub Actions. */
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4321",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined // Si baseURL externe (preview Vercel), on ne lance pas de serveur
    : {
        command: "pnpm dev",
        url: "http://localhost:4321",
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
