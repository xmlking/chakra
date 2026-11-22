import { log } from "evlog";
import { definePlugin } from "nitro";
import type { NitroApp } from "nitro/types";

import { eventBusService } from "#server/services/event-bus.server";

/**
 * Boots the Postgres LISTEN/NOTIFY event bus with the Nitro app and tears it down on `close`.
 * Subscribe elsewhere with `eventBusService.on(...)`; `publish(...)` works before this runs because it
 * only needs the Drizzle pool.
 */
// oxlint-disable-next-line import/no-default-export
export default definePlugin(async (nitroApp: NitroApp) => {
  nitroApp.hooks?.hook("close", async () => {
    await eventBusService.shutdown();
  });

  try {
    await eventBusService.start();
  } catch (error) {
    // Don't block boot: the bus will keep retrying through its own reconnect loop.
    log.error({ action: "event-bus:plugin", error });
  }
});
