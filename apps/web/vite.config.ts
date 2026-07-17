import { aui } from "@assistant-ui/vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import ViteEnv from "@vite-env/core/plugin";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { getBuildInfo } from "@workspace/shared/git-helpers";
import evlog from "evlog/nitro/v3";
import ViteEvlog from "evlog/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite-plus";
import zodCompiler from "zod-compiler/vite";

const config = defineConfig({
  envDir: "../..", // HINT: use workspace root .env files
  resolve: { tsconfigPaths: true },
  plugins: [
    aui(),
    zodCompiler(),
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
      plugins: ["./src/server/plugins/evlog-auth.ts", "./src/server/plugins/evlog-drain.ts"],
      // preset: "bun",
      // compressPublicAssets: { brotli: true },
      experimental: {
        asyncContext: true,
      },
      modules: [
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
    viteReact(),
    babel({
      presets: [reactCompilerPreset()],
      // TODO: remove after TanStack Table v9
      exclude: ["**/components/reui/data-grid/**"],
    }),
  ],
  define: getBuildInfo(),
});

export default config;
