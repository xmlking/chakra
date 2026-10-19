import { sleep } from "@workspace/shared";
import { log } from "evlog";
import type { TaskPayload } from "nitro/types";

import { eventBus } from "#server/services/event-bus";

export async function doBackgroundWork(payload: TaskPayload) {
  log.info({
    action: "doBackgroundWork",
    job: "onramp-webhooks-check",
    payload,
    eventBusMetrics: eventBus.getMetrics(),
  });
  await sleep(1000); // Sleep for 1 second
}
