import { defineConfig } from "@playwright/test";

const testEnvironment = {
  DATABASE_URL:
    process.env.DATABASE_URL ?? "postgresql://portfolio:portfolio@127.0.0.1:5432/portfolio",
  NODE_ENV: process.env.NODE_ENV ?? "test",
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ?? "test-only-payload-secret-at-least-32-characters",
  SITE_URL: process.env.SITE_URL ?? "http://127.0.0.1:3000",
};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: testEnvironment.SITE_URL,
  },
  webServer: {
    command: "bun run dev",
    env: { ...process.env, ...testEnvironment },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: testEnvironment.SITE_URL,
  },
});
