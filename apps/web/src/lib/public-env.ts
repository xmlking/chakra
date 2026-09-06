import { getPublicDynamicEnv, loadPublicDynamicEnv } from "varlock/env";

/**
 * Runtime delivery of `@public @dynamic` config (BETTER_AUTH_URL, TURNSTILE_SITE_KEY,
 * feature flags) to the browser.
 *
 * Static public items are inlined into the client bundle at build time. Dynamic ones
 * are resolved when the server boots, so the same image can serve any host and flags
 * can change without a rebuild. They reach the browser in two ways:
 *
 * 1. `publicEnvBootScript()` is rendered as an inline `<script>` in the document head
 *    (see routes/__root.tsx). It runs before any module script, so `ENV.X` is already
 *    hydrated when app code first reads it.
 * 2. `refreshPublicEnv()` re-fetches the values from `/api/public-env`
 *    (see routes/api/public-env.ts) for callers that want fresh flags without a reload.
 */

/** Served by routes/api/public-env.ts. */
export const PUBLIC_ENV_ENDPOINT = "/api/public-env";

/** Every `@public @dynamic` item and its current value. Sensitive items are never included. */
export function getPublicEnv() {
  return getPublicDynamicEnv();
}

/** Inline script that hydrates varlock's `ENV` in the browser before module scripts run. */
export function publicEnvBootScript() {
  // `<` is escaped so a value can never terminate the script tag.
  const values = JSON.stringify(getPublicEnv()).replaceAll("<", "\\u003c");
  const endpoint = JSON.stringify(PUBLIC_ENV_ENDPOINT);
  return `globalThis.__varlockPublicDynamicEnv=${values};globalThis.__varlockPublicDynamicEnvEndpoint=${endpoint};`;
}

/** Browser only. Re-fetches the dynamic public values and updates `ENV` in place. */
export function refreshPublicEnv() {
  return loadPublicDynamicEnv({ endpoint: PUBLIC_ENV_ENDPOINT, force: true });
}
