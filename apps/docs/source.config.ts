import { changelogMetaSchema, changelogPageSchema } from "@fumapress/tegami/schema";
import {
  remarkSteps,
  remarkImage,
  remarkMdxMermaid,
  remarkMdxFiles,
  remarkDirectiveAdmonition,
} from "fumadocs-core/mdx-plugins";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import {
  metaSchema,
  pageSchema,
  blogMetaSchema,
  blogPageSchema,
} from "fumapress/adapters/mdx/schema";
import remarkDirective from "remark-directive";

export const docs = defineDocs({
  // dir: fileURLToPath(new URL("content/docs", import.meta.url)),
  dir: "../../content/docs",
  docs: {
    async: true,
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
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
      extractLinkReferences: true,
    },
  },
  meta: {
    schema: blogMetaSchema,
  },
});

export const changelog = defineDocs({
  dir: "../../content/changelog",
  docs: {
    async: true,
    schema: changelogPageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
    },
  },
  meta: {
    schema: changelogMetaSchema,
  },
});

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    // MDX options
    // preset: 'fumadocs',
    remarkPlugins: [
      remarkMdxMermaid,
      remarkImage,
      remarkSteps,
      remarkMdxFiles,
      remarkDirective,
      remarkDirectiveAdmonition,
    ],
    // rehypePlugins: [rehypeToc],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
