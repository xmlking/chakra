import ViteEnv from "@vite-env/core/plugin";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [ViteEnv()],
  build: {
    ssr: true,
    lib: {
      entry: "src/index.ts",
      name: "email",
      formats: ["es"],
    },
    write: false, // Prevents writing the 'dist' folder
  },
});
