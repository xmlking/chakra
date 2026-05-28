import { fileURLToPath, URL } from "node:url";

import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import ViteEnv from "@vite-env/core/plugin";
import viteReact from "@vitejs/plugin-react";
import { runCmd } from "@workspace/shared/git-helpers";
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
  define: {
    // String values must be wrapped in JSON.stringify() to be valid replacements
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? "dev"),
    __GIT_TAG__: JSON.stringify(
      process.env.GITHUB_REF_NAME ||
        process.env.VERCEL_GIT_COMMIT_REF ||
        runCmd("git describe --tags --always"),
    ),
    __GIT_SHA__: JSON.stringify(
      process.env.GITHUB_SHA ||
        process.env.VERCEL_GIT_COMMIT_SHA ||
        runCmd("git rev-parse --short HEAD"),
    ),
    __GIT_TIME__: JSON.stringify(runCmd("git log -1 --format=%ci") ?? new Date().toISOString()),
  },
});

export default config;
