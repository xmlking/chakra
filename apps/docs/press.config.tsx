import path from "node:path";

import { lucideIconsPlugin } from "fumadocs-core/source/plugins/lucide-icons";
import { createOpenAPI } from "fumadocs-openapi/server";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Card, Cards } from "fumadocs-ui/components/card";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from "fumadocs-ui/components/tabs";
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx";
import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { createDocsLayoutPage } from "fumapress/layouts/docs";
import { createHomeLayout } from "fumapress/layouts/home";
import { blogPlugin } from "fumapress/plugins/blog";
import { flexsearchPlugin } from "fumapress/plugins/flexsearch";
import { imagePlugin } from "fumapress/plugins/image/vercel";
// import { linkValidationPlugin } from "fumapress/plugins/link-validation";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
// import { githubFeedbackPlugin } from "@fumapress/feedback/github";
import { openapiPlugin } from "fumapress/plugins/openapi";
import { sitemapPlugin } from "fumapress/plugins/sitemap";
import { takumiPlugin } from "fumapress/plugins/takumi";
import { BookIcon, RssIcon } from "lucide-react";

import { ClientAPIPage } from "@/components/api";
import { Mermaid } from "@/components/mdx/mermaid";

import { blog, docs } from "./.source/server";

const basePath = import.meta.env.VITE_DOCS_BASE_PATH || "/";

export const openapi = createOpenAPI({
  // path or URL to your OpenAPI spec.
  input: ["../../content/openapi.json"],
  // proxyUrl: "/_proxy", // TODO: enable after  mode: "static" is removed
});

const config = defineConfig({
  mode: "static",
  content: {
    docs: docs.toFumadocsSource({
      baseDir: "docs",
    }),
    blog: blog.toFumadocsSource({
      baseDir: "blog",
    }),
    openapi: await openapi.staticSource({
      baseDir: "docs/openapi/(generated)",
    }),
  },
  loaderOptions: {
    plugins: [lucideIconsPlugin()],
  },
  site: {
    name: "Chakra",
    baseUrl: import.meta.env.DEV ? "http://localhost:3000" : "https://xmlking.github.io/chakra/",
    git: {
      user: "xmlking",
      branch: "main",
      repo: "chakra",
    },
  },
  meta: {
    root() {
      return (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" href={`${basePath}favicon.ico`} type="image/x-icon" />
        </>
      );
    },
  },
})
  .adapters(
    fumadocsMdx({
      async getMdxComponents(page) {
        const source = await this.getLoader();

        return {
          File,
          Files,
          Folder,
          Steps,
          Step,
          Accordion,
          Accordions,
          Mermaid,
          Tab,
          Tabs,
          TabsContent,
          TabsList,
          TabsTrigger,
          ...defaultMdxComponents,
          a: createRelativeLink(source, page),
          DocsCategory() {
            const dir = path.dirname(page.path);
            const items = source
              .getPages(page.locale)
              .filter(
                (item) =>
                  item.path !== page.path && !path.relative(dir, item.path).startsWith(".."),
              );

            return (
              <Cards>
                {items.map((item) => (
                  <Card key={item.path} href={item.url} title={item.data.title}>
                    {item.data.description}
                  </Card>
                ))}
              </Cards>
            );
          },
        };
      },
    }),
  )
  .plugins(
    flexsearchPlugin(),
    llmsPlugin(),
    takumiPlugin(),
    sitemapPlugin(),
    // linkValidationPlugin(), // FIXME
    openapiPlugin({
      server: openapi,
      ClientAPIPage,
      // mode: "static" doesn't support proxy,
      // you can use this option in "server" mode
      // createProxy: true,
    }),
    imagePlugin({
      formats: ["image/webp", "image/png"],
    }),
    // githubFeedbackPlugin({
    //   appId: import.meta.env.GITHUB_APP_ID,
    //   privateKey: import.meta.env.GITHUB_PRIVATE_KEY,
    //   // your repository info, e.g.
    //   storage: {
    //     owner: "xmlking",
    //     repo: "chakra",
    //     category: "Feedback",
    //   },
    // }),
  )
  .layouts({
    defaultProps() {
      return {
        nav: {
          title: (
            <>
              {/* <img
                src="/logo.png"
                width={64}
                height={64}
                className="size-8 rounded-full shadow-md shadow-black mb-1"
              /> */}
              <img
                alt="logo"
                src={`${basePath}chakra2.svg`}
                width="64"
                height="64"
                className="mb-1 size-8 rounded-full shadow-sm shadow-black dark:invert"
              />
              <span>
                <span className="border-fd-primary border-b-2 font-mono uppercase">Chakra</span>
                <br />
                <span className="text-fd-muted-foreground text-xs font-normal">The agent guru</span>
              </span>
            </>
          ),
        },
      };
    },
    page: createDocsLayoutPage({
      async render({ locale }) {
        let pageTree = (await this.getLoader()).getPageTree(locale);

        for (const child of pageTree.children) {
          if (child.type === "folder" && child.$id === "docs") {
            pageTree = {
              ...pageTree,
              children: child.children,
            };
          }
        }

        return {
          layoutProps: {
            tree: pageTree,
          },
        };
      },
    }),
  });

export const HomeLayout = createHomeLayout<Ctx>({
  layoutProps: {
    links: [
      {
        url: "/docs",
        text: "Documentation",
        icon: <BookIcon />,
        active: "nested-url",
      },
      {
        url: "/blog",
        text: "Blog",
        icon: <RssIcon />,
        active: "nested-url",
      },
    ],
  },
});

export type Ctx = typeof config.$context;

// oxlint-disable-next-line import/no-default-export react/only-export-components react-doctor/only-export-components
export default config.plugins(
  blogPlugin({
    layouts: {
      layout: HomeLayout,
    },
  }),
);
