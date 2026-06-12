import ViteEnv from "@vite-env/core/plugin";
import { defineConfig } from "vite-plus";

export default defineConfig({
  envDir: "../..", // HINT: use workspace root .env files
  plugins: [
    ViteEnv({
      serverEnvironments: ["ssr"],
    }),
  ],
  build: {
    ssr: true,
    lib: {
      entry: "src/index.ts",
      name: "storage",
      formats: ["es"],
    },
    write: false, // Prevents writing the 'dist' folder
  },
});
