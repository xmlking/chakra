import { sleep } from "@workspace/shared";
import { log } from "evlog";
import { defineTask } from "nitro/task";
import type { TaskPayload } from "nitro/types";

import { eventBusService } from "#server/services/event-bus.server";

async function logEventBusMetrics(payload: TaskPayload) {
  log.info({
    action: "event-bus-metrics",
    payload,
    eventBusMetrics: eventBusService.getMetrics(),
  });
  await sleep(1000); // Sleep for 1 second
}

/**
 * Example scheduled task: logs the event bus connection metrics on the
 * `nitro.config.ts` `scheduledTasks` cron, showcasing how Nitro tasks work.
 *
 * Note: Using context.waitUntil?.() is essential to prevent serverless environments
 * (like Cloudflare Workers or Vercel) from shutting down before your background task completes
 */
// oxlint-disable-next-line import/no-default-export
export default defineTask({
  meta: {
    name: "event-bus-metrics",
    description: "Log event bus connection metrics",
  },
  async run({ payload, context }) {
    log.info("event-bus-metrics", "Running task");
    const promise = logEventBusMetrics(payload);
    // @ts-expect-error Nitro's task context type does not include the runtime waitUntil hook.
    context.waitUntil?.(promise);
    await promise;
    return { result: "Success" };
  },
});
