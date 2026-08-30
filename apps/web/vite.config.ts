import { aui } from "@assistant-ui/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import ViteEnv from "@vite-env/core/plugin";
import react from "@vitejs/plugin-react";
import { getBuildInfo } from "@workspace/shared/git-helpers";
import evlog from "evlog/nitro/v3";
import ViteEvlog from "evlog/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite-plus";
import { workflow } from "workflow/vite";

const config = defineConfig({
  envDir: "../..", // HINT: use workspace root .env files
  resolve: { tsconfigPaths: true },
  plugins: [
    aui(),
    ViteEnv(),
    devtools(),
    ViteEvlog({
      service: "chakra",
      environment: process.env.NODE_ENV,
      sourceLocation: "dev",
      client: {
        console: false,
        transport: {
          enabled: true,
          endpoint: "/api/_evlog/ingest",
        },
      },
    }),
    nitro({
      experimental: {
        asyncContext: true,
        envExpansion: true,
        tasks: true,
      },
      plugins: [
        "./src/server/plugins/evlog-auth.ts",
        "./src/server/plugins/evlog-drain.ts",
        "./src/server/plugins/start-pg-world.ts"
      ],
      tasks: {
        "work:onramp-webhooks-check": {
          handler: "#server/tasks/onramp-webhooks-check.ts",
          description: "Run onramp webhooks check",
        },
      },
      scheduledTasks: {
        // Run `onramp-webhooks-check` task every minute
        "* * * * *": ["work:onramp-webhooks-check"],
      },
      // preset: "bun",
      // compressPublicAssets: { brotli: true },
      modules: [
        // this is the plugin that enables path aliases
        "workflow/nitro",
        evlog({
          env: { service: "chakra" },
          exclude: [
            "/.well-known/**",
            "/api/health/**",
            "/api/_evlog/**",
            "/_build/**",
            "/assets/**",
          ],
          // include: ["/api/**"],
          // routes: {
          //   "/api/auth/**": { service: "auth-service" },
          //   "/api/payment/**": { service: "payment-service" },
          // },
        }),
      ],
      rollupConfig: { external: [/^@sentry\//, "motion"] },
    }),
    tailwindcss(),
    tanstackStart(),
    react({ compiler: true }),
    workflow(),
  ],
  define: getBuildInfo(),
});

export default config;
