import { log } from "evlog";
import { defineTask } from "nitro/task";

import { doBackgroundWork } from "#server/services/bg";

/**
 * A task that can be scheduled to run in the background
 *
 * Note: Using context.waitUntil?.() is essential to prevent serverless environments
 * (like Cloudflare Workers or Vercel) from shutting down before your background task completes
 */
// oxlint-disable-next-line import/no-default-export
export default defineTask({
  meta: {
    name: "onramp-webhooks-check",
    description: "Check for onramp webhooks",
  },
  async run({ payload, context }) {
    log.info("onramp-webhooks-check", "Running task");
    const promise = doBackgroundWork(payload);
    // @ts-expect-error Nitro's task context type does not include the runtime waitUntil hook.
    context.waitUntil?.(promise);
    await promise;
    return { result: "Success" };
  },
});
