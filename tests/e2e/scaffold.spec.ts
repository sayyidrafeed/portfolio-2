import { expect, test } from "@playwright/test";

test("public scaffold is reachable", async ({ request }) => {
  const response = await request.get("/");

  expect(response.status()).toBe(200);
  await expect(response.text()).resolves.toContain("Portfolio scaffold");
});

test("health endpoint is reachable", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toEqual({
    service: "portfolio",
    status: "ok",
  });
});

test("Payload Studio route is mounted", async ({ request }) => {
  const response = await request.get("/studio");

  expect(response.status()).toBeLessThan(500);
  expect(response.url()).toContain("/studio");
});
