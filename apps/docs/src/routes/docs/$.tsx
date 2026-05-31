// oxlint-disable react-doctor/jsx-pascal-case
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import browserCollections from "collections/browser";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { MessageCircleIcon } from "lucide-react";
import { Suspense, type ReactNode } from "react";
import {cn } from "@workspace/ui/lib/utils"
import { ClientAPIPage } from "@/components/api-page";
import { AISearch, AISearchPanel, AISearchTrigger } from "@/components/ai/search";
import { useMDXComponents } from "@/components/mdx";
import { baseOptions } from "@/lib/layout.shared";
import { gitConfig } from "@/lib/shared";
import { slugsToMarkdownPath, source } from "@/lib/source";

export const Route = createFileRoute("/docs/$")({
  component: Page,
  // oxlint-disable-next-line react-doctor/tanstack-start-loader-parallel-fetch
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/") ?? [];
    const data = await serverLoader({ data: slugs });

    if (data.type === "docs") {
      await clientLoader.preload(data.path);
    }
    return data;
  },
});

const serverLoader = createServerFn({
  method: "GET",
})
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();

    const pageTree = await source.serializePageTree(source.getPageTree());
    if (page.type === "openapi") {
      return {
        type: "openapi",
        title: page.data.title,
        description: page.data.description,
        pageTree,
        props: await page.data.getClientAPIPageProps(),
      };
    }

    return {
      type: "docs",
      path: page.path,
      markdownUrl: slugsToMarkdownPath(page.slugs).url,
      pageTree,
    };
  });

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: MDX },
    // you can define props for the component
    {
      markdownUrl,
      path,
    }: {
      markdownUrl: string;
      path: string;
    },
  ) {
    return (
      <DocsPage toc={toc} tableOfContent={{ style: "clerk" }}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <div className="-mt-4 flex flex-row items-center gap-2 border-b pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`}
          />
        </div>
        <DocsBody>
          {/* oxlint-disable-next-line react-doctor/jsx-pascal-case */}
          {/* oxlint-disable-next-line react-doctor/rules-of-hooks */}
          <MDX components={useMDXComponents()} />
        </DocsBody>
      </DocsPage>
    );
  },
});

// oxlint-disable-next-line react-doctor/only-export-components
function Page() {
  const page = useFumadocsLoader(Route.useLoaderData());
  let content: ReactNode;

  if (page.type === "openapi") {
    content = (
      <DocsPage full>
        <DocsTitle>{page.title}</DocsTitle>
        <DocsDescription>{page.description}</DocsDescription>
        <DocsBody>
          <ClientAPIPage {...page.props} />
        </DocsBody>
      </DocsPage>
    );
  } else {
    content = <Suspense>{clientLoader.useContent(page.path, page)}</Suspense>;
  }

  return (
    <DocsLayout {...baseOptions()} tree={page.pageTree}>
      <AISearch>
        <AISearchPanel />
        <AISearchTrigger
          position="float"
          className={cn(
            buttonVariants({
              variant: "secondary",
              className: "text-fd-muted-foreground rounded-2xl",
            }),
          )}
        >
          <MessageCircleIcon className="size-4.5" />
          Ask AI
        </AISearchTrigger>
      </AISearch>

      {content}
    </DocsLayout>
  );
}
