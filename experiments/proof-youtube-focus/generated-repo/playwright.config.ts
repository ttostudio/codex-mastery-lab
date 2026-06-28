import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  timeout: 120_000,
  expect: { timeout: 90_000 },
  globalTeardown: "./e2e/global-teardown.ts",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 1,
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }], ["list"]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure"
  },
  webServer: {
    command: "pnpm run mock:start && NODE_NO_WARNINGS=1 STUDYSTREAM_USE_EXTERNAL_MOCKS=1 pnpm exec next dev --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    { name: "chromium", testMatch: /.*\.spec\.ts/, use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", testMatch: /studystream\.spec\.ts/, use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", testMatch: /studystream\.spec\.ts/, use: { ...devices["Desktop Safari"] } }
  ]
});
