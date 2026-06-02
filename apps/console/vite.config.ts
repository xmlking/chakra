import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import ViteEnv from "@vite-env/core/plugin";
import viteReact from "@vitejs/plugin-react";
import { getBuildInfo } from "@workspace/shared/git-helpers";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite-plus";
import { workflow } from "workflow/vite";

const config = defineConfig({
  root: import.meta.dirname,
  envDir: "../..", // HINT: use workspace root .env files
  resolve: { tsconfigPaths: true },
  plugins: [
    workflow(),
    ViteEnv(),
    devtools(),
    nitro({
      modules: ["workflow/nitro"],
      workflow: {
        dirs: ["src/workflows"],
      },
      rollupConfig: { external: [/^@sentry\//] },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  define: getBuildInfo(),
});

export default config;
