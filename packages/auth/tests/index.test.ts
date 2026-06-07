import type { TestHelpers } from "better-auth/plugins";
import { v7 as uuidv7 } from "uuid";
import { afterAll, beforeAll, describe, expect, it } from "vite-plus/test";

import { auth } from "../src";

/**
 * These are integration tests against Better Auth server APIs using the testUtils()
 * plugin helpers (factories/login/headers/cookies/db cleanup).
 */
// oxlint-disable-next-line vitest/no-disabled-tests
describe("auth (better-auth + testUtils plugin)", () => {
  let test: TestHelpers;
  const createdUserIds: string[] = [];

  beforeAll(async () => {
    const ctx = await auth.$context;
    test = ctx.test;
  });

  afterAll(async () => {
    // Always cleanup users created during tests (best-effort)
    await Promise.all(
      createdUserIds.map(async (id) => {
        try {
          await test.deleteUser(id);
        } catch {
          // ignore - user may already be deleted
        }
      }),
    );
  });

  it("creates an authenticated session for a saved user (getAuthHeaders + getSession)", async () => {
    const user = test.createUser({ id: uuidv7() });
    const saved = await test.saveUser(user);
    createdUserIds.push(saved.id);

    const headers = await test.getAuthHeaders({ userId: saved.id });
    const session = await auth.api.getSession({ headers });

    expect(session).toBeTruthy();
    expect(session?.user.id).toBe(saved.id);
  });

  it("login() returns session + headers and getSession honors those headers", async () => {
    const user = test.createUser({
      id: uuidv7(),
      email: `login-${Date.now()}@example.com`,
      name: "Login User",
    });
    const saved = await test.saveUser(user);
    createdUserIds.push(saved.id);

    const { headers, session } = await test.login({ userId: saved.id });

    expect(session.userId).toBe(saved.id);

    const apiSession = await auth.api.getSession({ headers });
    expect(apiSession?.user.id).toBe(saved.id);
  });

  it("getCookies() returns cookies that can be injected into a browser context (shape sanity check)", async () => {
    const user = test.createUser({ id: uuidv7(), email: `cookies-${Date.now()}@example.com` });
    const saved = await test.saveUser(user);
    createdUserIds.push(saved.id);

    const cookies = await test.getCookies({ userId: saved.id, domain: "localhost" });

    expect(Array.isArray(cookies)).toBe(true);
    expect(cookies.length).toBeGreaterThan(0);

    // Basic shape checks for Playwright-compatible cookies
    for (const c of cookies) {
      expect(c).toHaveProperty("name");
      expect(c).toHaveProperty("value");
      expect(c).toHaveProperty("domain");
      expect(c).toHaveProperty("path");
    }
  });
});
