import { fileURLToPath, URL } from "node:url";

import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import ViteEnv from "@vite-env/core/plugin";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite-plus";

const config = defineConfig({
  envDir: "../..", // HINT: use workspace root .env files
  resolve: { tsconfigPaths: true },
  plugins: [
    ViteEnv(),
    devtools(),
    paraglideVitePlugin({
      project: fileURLToPath(new URL("./project.inlang", import.meta.url)),
      outdir: fileURLToPath(new URL("./src/paraglide", import.meta.url)),
      strategy: ["cookie", "preferredLanguage", "baseLocale"],
    }),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});

export default config;
