import { getPressContext } from "@fumapress/astro/runtime";
import { expect, it, vi } from "vite-plus/test";

import { buildGraph } from "./build-graph";

vi.mock("@fumapress/astro/runtime", () => ({ getPressContext: vi.fn<() => unknown>() }));

/**
 * a page of an Astro collection (`@fumadocs/astro`): `pageLoader()` stores `extractedReferences` in its data, `load()`
 * only compiles the content
 */
function astroPage(url: string, title: string, references: string[]) {
  return {
    url,
    data: {
      title,
      extractedReferences: references.map((href) => ({ href })),
      load: async () => ({ body: () => null, toc: [] }),
    },
  };
}

it("links pages by the extracted references in their data", async () => {
  const pages = [
    astroPage("/docs", "Introduction", ["/docs/guide", "/docs/missing"]),
    astroPage("/docs/guide", "Guide", []),
  ];
  vi.mocked(getPressContext).mockReturnValue({
    getLoader: async () => ({ getPages: () => pages }),
  } as unknown as ReturnType<typeof getPressContext>);

  const graph = await buildGraph();

  expect(graph.nodes.map((node) => node.id)).toEqual(["/docs", "/docs/guide"]);
  expect(graph.links).toEqual([{ source: "/docs", target: "/docs/guide" }]);
});
