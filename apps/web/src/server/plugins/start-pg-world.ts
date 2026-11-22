import { log } from "evlog";
import { definePlugin } from "nitro";

import { ENV } from "#env";

// oxlint-disable-next-line import/no-default-export
export default definePlugin(async () => {
  if (ENV.WORKFLOW_TARGET_WORLD === "@workflow/world-postgres") {
    // Dynamic import to avoid edge runtime bundling issues
    log.info("start-pg-world", "Starting Postgres World...");
    const { createWorld } = await import("@workflow/world-postgres");
    await createWorld({
      // The workflow engine lives in the app's own database: world-postgres
      // itself falls back to DATABASE_URL, so there is no separate
      // WORKFLOW_POSTGRES_URL to declare or keep in sync.
      connectionString: ENV.DATABASE_URL,
      jobPrefix: ENV.WORKFLOW_POSTGRES_JOB_PREFIX,
      queueConcurrency: ENV.WORKFLOW_POSTGRES_WORKER_CONCURRENCY,
      maxPoolSize: ENV.WORKFLOW_POSTGRES_MAX_POOL_SIZE,
    }).start?.();
    log.info("start-pg-world", "Postgres World started");
  }
});
