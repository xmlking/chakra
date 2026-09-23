import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: { deps: { resolveDepSubpath: true }, dts: { generator: "tsgo", tsgo: {} }, exports: true },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
