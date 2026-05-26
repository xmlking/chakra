import ViteEnv from "@vite-env/core/plugin";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [ViteEnv()],
  pack: {
    dts: {
      tsgo: true,
    },
    exports: true,
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
