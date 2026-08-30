import { log } from "evlog";
import { definePlugin } from "nitro";
import { env } from "virtual:env/server";

// oxlint-disable-next-line import/no-default-export
export default definePlugin(async () => {
  if (env.WORKFLOW_TARGET_WORLD === "@workflow/world-postgres") {
    // Dynamic import to avoid edge runtime bundling issues
    log.info("start-pg-world", "Starting Postgres World...");
    const { createWorld } = await import("@workflow/world-postgres");
    await createWorld({
      connectionString: env.WORKFLOW_POSTGRES_URL ?? env.DATABASE_URL,
      jobPrefix: env.WORKFLOW_POSTGRES_JOB_PREFIX,
      queueConcurrency: env.WORKFLOW_POSTGRES_WORKER_CONCURRENCY,
      maxPoolSize: env.WORKFLOW_POSTGRES_MAX_POOL_SIZE,
    }).start?.();
    log.info("start-pg-world", "Postgres World started");
  }
});
