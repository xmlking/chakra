import { fileURLToPath, URL } from "node:url";

import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [
    paraglideVitePlugin({
      project: fileURLToPath(new URL("./project.inlang", import.meta.url)),
      outdir: fileURLToPath(new URL("./src/paraglide", import.meta.url)),
      strategy: ["globalVariable", "cookie", "preferredLanguage", "baseLocale"],
      emitTsDeclarations: true, // Set this flag to generate .d.ts files
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "MyLib",
      formats: ["es"],
    },
    write: false, // Prevents writing the 'dist' folder
  },
});
