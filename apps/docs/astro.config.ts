import "varlock/auto-load";
import { remarkDirectiveAdmonition } from "@fumadocs/satteri/remark-directive-admonition";
import { remarkMdxFiles } from "@fumadocs/satteri/remark-mdx-files";
import { remarkMdxMermaid } from "@fumadocs/satteri/remark-mdx-mermaid";
import { remarkSteps } from "@fumadocs/satteri/remark-steps";
import press from "@fumapress/astro";
import tailwindcss from "@tailwindcss/vite";
import varlockAstroIntegration from "@varlock/astro-integration";
import { defineConfig } from "astro/config";

import { ENV } from "./env";

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
  // full URL of the deployed site, for canonical links, the sitemap, RSS and OG images
  site: "https://docs.chakra.ai",
  // e.g. `/chakra/` on GitHub Pages
  base: ENV.DOCS_BASE_PATH,
  integrations: [
    // static site: no server to answer `/__varlock/public-env`, and its on-demand route makes
    // `astro preview` demand an adapter (varlock only skips it for `astro build`)
    varlockAstroIntegration({ publicDynamicEndpoint: false }),
    press({
      components: "./src/mdx-components.tsx",
      lastModified: true,
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
      // directories are relative to this app; the content lives at the repo root
      collections: {
        docs: { dir: "../../content/docs" },
        blog: { dir: "../../content/blog" },
        changelog: { dir: "../../content/changelog" },
      },
      // GFM, directives and images are on by default in the Fumadocs preset
      mdastPlugins: [
        remarkMdxMermaid(),
        remarkSteps(),
        remarkMdxFiles(),
        remarkDirectiveAdmonition(),
      ],
      rehypeCodeOptions: {
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
      },
    }),
  ],
  vite: {
    resolve: {
      // Content MDX lives outside this package (../../content) and the isolated
      // package linker keeps these only in apps/docs/node_modules, so resolve
      // them from the app root.
      dedupe: [
        "fumadocs-ui",
        "fumadocs-core",
        "react",
        "react-dom",
        "lucide-react",
        "@thesvg/react",
      ],
    },
    plugins: [tailwindcss()],
  },
});
