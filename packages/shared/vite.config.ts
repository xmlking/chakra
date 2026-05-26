import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    includeSource: ["src/**/*.{js,ts}"],
  },
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
