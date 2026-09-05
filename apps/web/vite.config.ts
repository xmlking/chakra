import { aui } from "@assistant-ui/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import ViteEnv from "@vite-env/core/plugin";
import react from "@vitejs/plugin-react";
import { getBuildInfo } from "@workspace/shared/git-helpers";
import ViteEvlog from "evlog/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite-plus";
import { workflow } from "workflow/vite";

export default defineConfig(() => {
  return {
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
      nitro(),
      tailwindcss(),
      tanstackStart(),
      react({ compiler: true }),
      workflow(),
    ],
    define: getBuildInfo(),
    build: {
      rolldownOptions: {
        external: ["shiki/wasm"],
      },
    },
    ssr: {
      external: ["shiki/wasm"],
    },
  };
});
