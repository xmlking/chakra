import { createFileRoute } from "@tanstack/react-router";

import { getPublicEnv } from "#lib/public-env";

/**
 * Serves the `@public @dynamic` env items (never anything sensitive) so the browser can
 * refresh them at runtime via `refreshPublicEnv()` (see #lib/public-env). Initial page
 * loads do not need this endpoint: the root document inlines the same values.
 */
export const Route = createFileRoute("/api/public-env")({
  server: {
    handlers: {
      GET: () => Response.json(getPublicEnv(), { headers: { "Cache-Control": "no-store" } }),
    },
  },
});
