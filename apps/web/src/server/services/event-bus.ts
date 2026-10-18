import { db } from "@workspace/db";
import { EventBus } from "@workspace/db/event-bus";

import { ENV } from "#env";

/**
 * Channel -> payload contract for this app. Add an entry here before publishing or subscribing;
 * both sides are then typed end-to-end.
 */
export type AppEvents = {
  /** Invalidate cached data tagged with any of `tags` on every instance. */
  "cache:invalidate": { tags: string[] };
};

export const eventBus = new EventBus<AppEvents>({
  connectionString: ENV.DATABASE_URL ?? "",
  ssl: ENV.DB_POOL_SSL,
  publisher: db,
  channelPrefix: `${ENV.APP_NAME}_`,
});
