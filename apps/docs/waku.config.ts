// @ts-nocheck https://github.com/wakujs/waku/issues/1812
import tailwindcss from "@tailwindcss/vite";
import mdx from "fumadocs-mdx/vite";
import press from "fumapress/vite";
import { defineConfig } from "waku/config";

export default defineConfig({
  vite: {
    base: "/chakra/",
    resolve: {
      tsconfigPaths: true,
      // Content MDX lives outside this package (../../content/docs) and the
      // isolated bun linker keeps react only in apps/docs/node_modules.
      // dedupe makes react/jsx-runtime resolve from the app root so the
      // compiled MDX (mode: "static") can be bundled.
      dedupe: ["react", "react-dom", "lucide-react", "@thesvg/react", "fumadocs-ui"],
    },
    // @takumi-rs/core is a native napi module (used by takumiPlugin for OG
    // images). Keep it external in the server-side environments so its loader
    // resolves the platform .node package from its own node_modules location
    // (the bun isolated store) at runtime, instead of being bundled into
    // dist/server where the dynamic require can't find the platform package.
    environments: {
      rsc: { resolve: { external: ["@takumi-rs/core"] } },
      ssr: { resolve: { external: ["@takumi-rs/core"] } },
    },
    optimizeDeps: {
      include: ["use-sync-external-store/shim/with-selector", "use-sync-external-store/shim"],
      exclude: ["@base-ui/react", "@base-ui/utils", "lucide-react"],
    },
    plugins: [press(), mdx(), tailwindcss()],
  },
});
