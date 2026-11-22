import { getPublicDynamicEnv, loadPublicDynamicEnv } from "varlock/env";

/**
 * Runtime delivery of `@public @dynamic` config (APP_ENV, BETTER_AUTH_URL, TURNSTILE_SITE_KEY,
 * ALLOWED_EMAIL_DOMAINS, feature flags) to the browser.
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

/**
 * Explicit allowlist of items meant for the browser, enforced here rather than
 * relying solely on each schema's `@sensitive`/`@dynamic` decorators.
 *
 * varlock ships a `@dynamic` item to the browser whenever it is not
 * `@sensitive`, regardless of `@public` — `@sensitive=false` alone (often set
 * just to keep a value unredacted in server logs) is enough. A single
 * mismarked item in any imported schema would otherwise reach every page's
 * boot script with no code-level check. `getPublicDynamicEnv` only narrows
 * (it can't add keys varlock didn't already mark public+dynamic), so this
 * list is a second, independent gate: a key must pass both the schema *and*
 * this allowlist to leave the server.
 */
const PUBLIC_DYNAMIC_KEYS = [
  "APP_ENV",
  "BETTER_AUTH_URL",
  "TURNSTILE_SITE_KEY",
  "ALLOWED_EMAIL_DOMAINS",
  "FF_ENABLE_DARK_MODE",
];

/** Every allowlisted `@public @dynamic` item and its current value. */
export function getPublicEnv() {
  return getPublicDynamicEnv(PUBLIC_DYNAMIC_KEYS);
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
