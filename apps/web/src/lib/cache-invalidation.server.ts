import type { SqlExecutor } from "@workspace/db/event-bus";

import { eventBusService } from "#server/services/event-bus.server";

/**
 * Server half of cache invalidation; the client half is `#lib/cache-invalidation`.
 * Use this instead of publishing `cache:invalidate` directly:
 *  - `tags` must be non-empty: the client treats no tags as "every query in the org".
 *  - `tx` is required, so clients are notified only after the write commits.
 */
export function publishCacheInvalidation(
  tx: SqlExecutor,
  organizationId: string,
  tags: readonly [string, ...string[]],
) {
  return eventBusService.publishEvent("cache:invalidate", { organizationId, tags: [...tags] }, tx);
}
