import { describe, expect, it } from "vite-plus/test";

import { getPublicEnv, PUBLIC_ENV_ENDPOINT, publicEnvBootScript } from "./public-env";

describe("public env delivery", () => {
  it("exposes exactly the @public @dynamic items", () => {
    expect(Object.keys(getPublicEnv()).sort()).toEqual([
      "BETTER_AUTH_URL",
      "FF_ENABLE_DARK_MODE",
      "TURNSTILE_SITE_KEY",
    ]);
  });

  it("never includes sensitive items", () => {
    const env = getPublicEnv() as Record<string, unknown>;
    for (const key of [
      "BETTER_AUTH_SECRET",
      "DATABASE_URL",
      "TURNSTILE_SECRET_KEY",
      "OPENAI_API_KEY",
    ]) {
      expect(env).not.toHaveProperty(key);
    }
  });

  it("boot script hydrates the same values and points at the refresh endpoint", () => {
    const script = publicEnvBootScript();
    expect(script).toContain(
      `globalThis.__varlockPublicDynamicEnv=${JSON.stringify(getPublicEnv())}`,
    );
    expect(script).toContain(
      `globalThis.__varlockPublicDynamicEnvEndpoint="${PUBLIC_ENV_ENDPOINT}"`,
    );
    expect(script).not.toContain("</script>");
  });
});
