import { sleep } from "@workspace/shared";
import { log } from "evlog";
import type { TaskPayload } from "nitro/types";

export async function doBackgroundWork(payload: TaskPayload) {
  log.info({ action: "doBackgroundWork", job: "onramp-webhooks-check", payload });
  await sleep(1000); // Sleep for 1 second
}
