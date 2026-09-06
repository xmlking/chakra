import { aui } from "@assistant-ui/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { varlockVitePlugin } from "@varlock/vite-integration";
import react from "@vitejs/plugin-react";
import { getBuildInfo } from "@workspace/shared/git-helpers";
import ViteEvlog from "evlog/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite-plus";
import { workflow } from "workflow/vite";

export default defineConfig(() => {
  return {
    resolve: { tsconfigPaths: true },
    plugins: [
      // The server is always started via `varlock run` (see Dockerfile), so the
      // built SSR bundle only needs the init calls, not a second schema load.
      varlockVitePlugin({ ssrInjectMode: "init-only" }),
      aui(),
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
