import evlog from "evlog/nitro/v3";
import { defineConfig } from "nitro";

import { ENV } from "./env";

const ONRAMP_SCHEDULER_CRON = ENV.ONRAMP_SCHEDULER_CRON || "* * * * *";

export default defineConfig({
  // Nitro 3 defaults this to false, so `server/` is not scanned at all and
  // nothing under `server/middleware/` loads. Nitro 2 scanned it by default,
  // which is what the scaffold assumed.
  // serverDir: "./src/server",
  experimental: {
    asyncContext: true,
    envExpansion: true,
    tasks: true,
  },
  plugins: [
    "./src/server/plugins/evlog-auth.ts",
    "./src/server/plugins/evlog-drain.ts",
    "./src/server/plugins/start-pg-world.ts",
  ],
  tasks: {
    "work:onramp-webhooks-check": {
      handler: "#server/tasks/onramp-webhooks-check.ts",
      description: "Run onramp webhooks check",
    },
  },
  scheduledTasks: {
    // FIXME: https://github.com/nitrojs/nitro/pull/4416
    // Run `onramp-webhooks-check` task on schedule
    [ONRAMP_SCHEDULER_CRON]: ["work:onramp-webhooks-check"],
  },
  // preset: "bun",
  // compressPublicAssets: { brotli: true },
  modules: [
    // this is the plugin that enables path aliases
    // "workflow/nitro",
    evlog({
      env: { service: "chakra" },
      exclude: ["/.well-known/**", "/api/health/**", "/api/_evlog/**", "/_build/**", "/assets/**"],
      // include: ["/api/**"],
      // routes: {
      //   "/api/auth/**": { service: "auth-service" },
      //   "/api/payment/**": { service: "payment-service" },
      // },
    }),
  ],
  rollupConfig: { external: [/^@sentry\//, "motion"] },
  // Nitro enables wasm by default, which adds the "unwasm" export
  // condition. That routes `shiki/wasm` to its raw `onig.wasm` file, which
  // Vite/Rolldown cannot load during the SSR build ([UNLOADABLE_DEPENDENCY]).
  // Disabling it resolves `shiki/wasm` to its base64-inlined default — same
  // Oniguruma engine, no separate .wasm asset.
  wasm: false,
});
