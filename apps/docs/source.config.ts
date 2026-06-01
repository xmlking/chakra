import { remarkImage, remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import { remarkSteps } from "fumadocs-core/mdx-plugins/remark-steps";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import {
  metaSchema,
  pageSchema,
  blogMetaSchema,
  blogPageSchema,
} from "fumapress/adapters/mdx/schema";

export const docs = defineDocs({
  // dir: fileURLToPath(new URL("content/docs", import.meta.url)),
  dir: "../../content/docs",
  docs: {
    async: true,
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const blog = defineDocs({
  dir: "../../content/blog",
  docs: {
    async: true,
    schema: blogPageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: blogMetaSchema,
  },
});

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    // MDX options
    // preset: 'fumadocs',
    remarkPlugins: [remarkMdxMermaid, remarkImage, remarkSteps],
    // rehypePlugins: [rehypeToc],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
