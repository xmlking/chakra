import { getPressContext } from "fumapress";

import type PressConfig from "../../press.config";
import type { Graph } from "../components/graph-view";

// oxlint-disable-next-line react-doctor/server-auth-actions
export async function buildGraph(): Promise<Graph> {
  const { getLoader } = getPressContext<typeof PressConfig.$context>();
  const source = await getLoader();
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
