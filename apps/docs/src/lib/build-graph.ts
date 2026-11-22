import { getPressContext } from "@fumapress/astro/runtime";

import type { app } from "../../press.config";
import type { Graph } from "../components/graph-view";

// oxlint-disable-next-line react-doctor/server-auth-actions
export async function buildGraph(): Promise<Graph> {
  const source = await getPressContext<typeof app>().getLoader();
  const pages = source.getPages();
  const graph: Graph = { links: [], nodes: [] };
  const pageMap = new Map(pages.map((p) => [p.url, p]));

  for (const page of pages) {
    graph.nodes.push({
      id: page.url,
      url: page.url,
      text: (page.data as any).title,
      description: (page.data as any).description,
    });

    // `pageLoader()` of `@fumadocs/astro` stores them in the page data, no compile (`load()`) needed
    const extractedReferences = (page.data as any).extractedReferences ?? [];
    for (const ref of extractedReferences) {
      const refPage = pageMap.get(ref.href);
      if (!refPage) continue;

      graph.links.push({
        source: page.url,
        target: refPage.url,
      });
    }
  }

  return graph;
}
