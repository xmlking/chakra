import { definePlugin } from "nitro";
import type { NitroApp } from "nitro/types";

function isCloudflareWorker(): boolean {
  return typeof caches !== "undefined";
}

/**
 * NitroPlugin for logs
 * Logs appearing in `.evlog/logs/`.
 * if running in docker, mount the volume for logs.
 * if running in cloudflare worker, logs will be written to memory.
 * Docs: https://www.evlog.dev/integrate/adapters/self-hosted/fs
 */
// oxlint-disable-next-line import/no-default-export
export default definePlugin(async (nitroApp: NitroApp) => {
  if (!import.meta.env.DEV) {
    return;
  }

  if (isCloudflareWorker()) {
    const { createMemoryDrain } = await import("evlog/memory");
    nitroApp.hooks?.hook("evlog:drain", createMemoryDrain({ maxEvents: 1000 }));
    return;
  }

  const { createFsDrain } = await import("evlog/fs");
  nitroApp.hooks?.hook(
    "evlog:drain",
    createFsDrain({
      maxFiles: 7,
    }),
  );
});
