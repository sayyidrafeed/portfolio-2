import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnvironment = { ...process.env };

beforeEach(() => {
  process.env.DATABASE_URL = "postgresql://portfolio:portfolio@127.0.0.1:5432/portfolio";
  Object.assign(process.env, { NODE_ENV: "test" });
  process.env.PAYLOAD_SECRET = "test-only-payload-secret-at-least-32-characters";
  process.env.SITE_URL = "http://127.0.0.1:3000";
});

afterEach(() => {
  process.env = { ...originalEnvironment };
  vi.resetModules();
});

describe("environment validation", () => {
  it("fails during Node.js instrumentation when required configuration is missing", async () => {
    delete process.env.SITE_URL;
    process.env.NEXT_RUNTIME = "nodejs";
    vi.resetModules();
    const exit = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process exited with code ${code}`);
    });

    const { register } = await import("./instrumentation");

    await expect(register()).rejects.toThrow("process exited with code 1");
    expect(exit).toHaveBeenCalledWith(1);
  });

  it("rejects a partial R2 configuration", async () => {
    process.env.R2_BUCKET_NAME = "portfolio";
    delete process.env.R2_ACCESS_KEY_ID;
    delete process.env.R2_SECRET_ACCESS_KEY;
    delete process.env.R2_ENDPOINT;
    delete process.env.R2_PUBLIC_URL;
    vi.resetModules();

    await expect(import("./env")).rejects.toThrow(
      "Configure every R2 variable or leave every R2 variable empty",
    );
  });
});
