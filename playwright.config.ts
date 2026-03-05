import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 120_000,
  use: {
    baseURL: "http://localhost:3003",
    headless: true,
  },
  webServer: {
    command: "npm run dev",
    port: 3003,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
