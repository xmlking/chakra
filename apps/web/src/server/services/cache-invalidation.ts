import type { SqlExecutor } from "@workspace/db/event-bus";

import { eventBus } from "#server/services/event-bus";

export function publishCacheInvalidation(
  tx: SqlExecutor,
  organizationId: string,
  tags: readonly [string, ...string[]],
) {
  return eventBus.publish("cache:invalidate", { organizationId, tags: [...tags] }, tx);
}
