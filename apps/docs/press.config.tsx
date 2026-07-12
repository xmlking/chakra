import { changelogPlugin, createChangelogIndexPage } from "@fumapress/tegami";
import { getPageTreePeers } from "fumadocs-core/page-tree";
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
// import { imagePlugin } from "fumapress/plugins/image/self-hosted";
// import { linkValidationPlugin } from "fumapress/plugins/link-validation";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
// import { githubFeedbackPlugin } from "@fumapress/feedback/github";
import { openapiPlugin } from "fumapress/plugins/openapi";
import { sitemapPlugin } from "fumapress/plugins/sitemap";
import { takumiPlugin } from "fumapress/plugins/takumi";

import { Mermaid } from "@/components/mdx/mermaid";
import { OpenAPIPage } from "@/components/openapi";
import { Video } from "@/components/video";
import { baseOptions } from "@/layout-config";

import { blog, changelog, docs } from "./.source/server";

// HINT: use `basePath` setting in waku.config.ts. Defaults to  "/".
const basePath = import.meta.env.BASE_URL;

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
    changelog: changelog.toFumadocsSource({
      baseDir: "changelog",
    }),
  },
  loaderOptions: {
    plugins: [lucideIconsPlugin()],
  },
  site: {
    name: "Chakra",
    baseUrl: import.meta.env.DEV ? "http://localhost:3001" : "https://xmlking.github.io/chakra/",
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
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image:width" content="1200" />
          <meta name="twitter:image:height" content="630" />
          <meta name="twitter:creator" content="@xmlking" />
          <meta name="twitter:site" content="@xmlking" />
          <meta property="og:site_name" content="Chakra" />
          <meta property="og:type" content="website" />
          <link rel="icon" href={`${basePath}favicon.ico`} type="image/x-icon" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap"
            rel="stylesheet"
          />
        </>
      );
    },
  },
})
  .adapters(
    fumadocsMdx({
      async getMdxComponents(page) {
        const source = await this.getLoader();

        // oxlint-disable-next-line react/only-export-components
        function DocsCategory() {
          return (
            <Cards>
              {getPageTreePeers(source.getPageTree(page.locale), page.url).map((peer) => (
                <Card key={peer.url} title={peer.name} href={peer.url}>
                  {peer.description}
                </Card>
              ))}
            </Cards>
          );
        }

        return {
          File,
          Files,
          Folder,
          Steps,
          Step,
          Accordion,
          Accordions,
          Mermaid,
          Video,
          Tab,
          Tabs,
          TabsContent,
          TabsList,
          TabsTrigger,
          ...defaultMdxComponents,
          a: createRelativeLink(source, page),
          DocsCategory,
        };
      },
    }),
  )
  .plugins(
    flexsearchPlugin(),
    llmsPlugin(),
    takumiPlugin({ basePath }),
    sitemapPlugin(),
    // linkValidationPlugin(), // FIXME
    openapiPlugin({
      server: openapi,
      ClientAPIPage: OpenAPIPage,
      // mode: "static" doesn't support proxy,
      // you can use this option in "server" mode
      // createProxy: true,
    }),
    /**
     * [Fumapress] Image Optimization is not compatible with static mode, please disable it
     */
    // imagePlugin({ allowedHosts: ["xmlking.github.io"] }),
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
        nav: baseOptions.nav,
        githubUrl: baseOptions.githubUrl,
      };
    },
    page: createDocsLayoutPage({
      // renderBody() {
      //   // TODO shadcn typeset
      // },
      async render({ locale }) {
        const source = await this.getLoader();
        let tree = source.getPageTree(locale);

        for (const child of tree.children) {
          if (child.type === "folder" && child.$id === "docs") {
            tree = { ...tree, children: child.children };
          }
        }

        return {
          // pageProps: {
          //   tableOfContent: {
          //     footer: <SponsorsMarquee />,
          //   },
          // },
          layoutProps: {
            tree,
            // links: [
            //   { icon: <Shovel />, text: "Try in Playground", url: "/playground" },
            //   { icon: <Sparkles />, text: "Showcase", url: "/showcase" },
            // ],
          },
        };
      },
    }),
  });

const { children: _, ...homeLayoutProps } = baseOptions;
export const HomeLayout = createHomeLayout<Ctx>({
  layoutProps: {
    ...homeLayoutProps,
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
  changelogPlugin({
    layouts: {
      layout: HomeLayout,
      index: createChangelogIndexPage({
        heading: "Changelog",
        description: "What shipped recently.",
        pageSize: 10,
      }),
    },
  }),
);
