// import { githubFeedbackPlugin } from "@fumapress/feedback/github";
import { toFumadocsSource } from "@fumadocs/astro/source";
import { createPress, recommendedPreset } from "@fumapress/astro/config";
// oxlint-disable react/only-export-components react-doctor/only-export-components
import { blogPlugin } from "@fumapress/blog";
import { changelogPlugin } from "@fumapress/tegami";
// import { linkValidationPlugin } from "@fumapress/astro/plugins/link-validation";
import { getCollection } from "astro:content";
import { lucideIconsPlugin } from "fumadocs-core/source/plugins/lucide-icons";
import openapiPlugin from "fumadocs-openapi/press";
import { createOpenAPI } from "fumadocs-openapi/server";

import { OpenAPIPage } from "#components/openapi";

import { baseOptions } from "./src/layout-config";

// HINT: set by `base` in astro.config.ts. Defaults to "/".
const basePath = import.meta.env.BASE_URL;

// the collections and their MDX options are in src/content.config.ts and `press()` of astro.config.ts
export const openapi = createOpenAPI({
  // path or URL to your OpenAPI spec.
  input: ["../../content/openapi.json"],
  // proxyUrl: "/_proxy", // TODO: enable when the site is served by a server (needs `createProxy`)
});

export const app = createPress(
  {
    docs: toFumadocsSource(await getCollection("docs"), await getCollection("meta"), {
      baseDir: "docs",
    }),
    blog: toFumadocsSource(await getCollection("blog"), await getCollection("blogMeta"), {
      baseDir: "blog",
    }),
    openapi: await openapi.staticSource({
      baseDir: "docs/openapi/(generated)",
    }),
    changelog: toFumadocsSource(
      await getCollection("changelog"),
      await getCollection("changelogMeta"),
      { baseDir: "changelog" },
    ),
  },
  {
    loaderPlugins: [lucideIconsPlugin()],
  },
).plugins(
  // linkValidationPlugin(), // FIXME
  openapiPlugin({
    server: openapi,
    ClientAPIPage: OpenAPIPage,
    // the static S3 deployment doesn't support the proxy,
    // you can use this option when served by a server
    // createProxy: true,
  }),
  // githubFeedbackPlugin({
  //   appId: ENV.GITHUB_APP_ID,
  //   privateKey: ENV.GITHUB_PRIVATE_KEY,
  //   // your repository info, e.g.
  //   storage: {
  //     owner: ENV.GITHUB_OWNER,
  //     repo: ENV.GITHUB_REPO,
  //     category: ENV.DOCS_CATEGORY,
  //   },
  // }),
  blogPlugin({ source: "blog" }),
  changelogPlugin({ source: "changelog" }),
);

const { children: _, ...layoutProps } = baseOptions;

// oxlint-disable-next-line import/no-default-export react/only-export-components react-doctor/only-export-components
export default app.config({
  site: {
    name: "Chakra",
    git: {
      user: "xmlking",
      branch: "main",
      repo: "chakra",
    },
  },
  // charset and viewport are added by Fumapress
  head: [
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attrs: { name: "twitter:image:width", content: "1200" } },
    { tag: "meta", attrs: { name: "twitter:image:height", content: "630" } },
    { tag: "meta", attrs: { name: "twitter:creator", content: "@xmlking" } },
    { tag: "meta", attrs: { name: "twitter:site", content: "@xmlking" } },
    { tag: "meta", attrs: { property: "og:site_name", content: "Chakra" } },
    { tag: "meta", attrs: { property: "og:type", content: "website" } },
    { tag: "link", attrs: { rel: "icon", href: `${basePath}favicon.ico`, type: "image/x-icon" } },
    { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" } },
    {
      tag: "link",
      attrs: { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    },
    {
      tag: "link",
      attrs: {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap",
      },
    },
  ],
  ui: {
    layoutProps,
  },
  // Astro has no image plugin in the preset: Astro Images handles images
  preset: recommendedPreset(),
});
