import { remarkImage, remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import { remarkSteps } from "fumadocs-core/mdx-plugins/remark-steps";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
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
