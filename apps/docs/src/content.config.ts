import { metaLoader, pageLoader } from "@fumadocs/astro/loaders";
import { blogMetaSchema, blogPageSchema } from "@fumapress/blog/schema";
import { changelogMetaSchema, changelogPageSchema } from "@fumapress/tegami/schema";
import { defineCollection } from "astro:content";

// collection names match `collections` of `press()` in astro.config.ts
export const collections = {
  docs: defineCollection({ loader: pageLoader("docs") }),
  meta: defineCollection({ loader: metaLoader("docs") }),
  blog: defineCollection({ loader: pageLoader("blog"), schema: blogPageSchema }),
  blogMeta: defineCollection({ loader: metaLoader("blog"), schema: blogMetaSchema }),
  changelog: defineCollection({ loader: pageLoader("changelog"), schema: changelogPageSchema }),
  changelogMeta: defineCollection({ loader: metaLoader("changelog"), schema: changelogMetaSchema }),
};
