import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import ViteEnv from "@vite-env/core/plugin";
import viteReact from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite-plus";

const config = defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  envDir: "../..", // HINT: use workspace root .env files
  resolve: {
    tsconfigPaths: true,
    alias: {
      tslib: "tslib/tslib.es6.js",
    },
  },
  plugins: [
    ViteEnv(),
    devtools(),
    mdx(await import("./source.config"), {
      outDir: fileURLToPath(new URL("./.source", import.meta.url)),
    }),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
      },
    }),
    viteReact(),
  ],
});

export default config;
