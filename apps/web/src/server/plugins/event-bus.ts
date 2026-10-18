import { log } from "evlog";
import { definePlugin } from "nitro";
import type { NitroApp } from "nitro/types";

import { ENV } from "#env";
import { eventBus } from "#server/services/event-bus";

/**
 * Boots the Postgres LISTEN/NOTIFY event bus with the Nitro app and tears it down on `close`.
 * Subscribe elsewhere with `eventBus.on(...)`; `publish(...)` works before this runs because it
 * only needs the Drizzle pool.
 */
// oxlint-disable-next-line import/no-default-export
export default definePlugin(async (nitroApp: NitroApp) => {
  if (!ENV.DATABASE_URL) {
    log.warn({ action: "event-bus:plugin", message: "DATABASE_URL not set; event bus disabled" });
    return;
  }

  nitroApp.hooks?.hook("close", async () => {
    await eventBus.close();
  });

  try {
    await eventBus.start();
  } catch (error) {
    // Don't block boot: the bus will keep retrying through its own reconnect loop.
    log.error({ action: "event-bus:plugin", error });
  }
});
