import { GraphView } from "@/components/graph-view";
import { buildGraph } from "@/lib/build-graph";

// oxlint-disable-next-line import/no-default-export
export default async function GraphPage() {
  const graph = await buildGraph();

  return (
    <div className="mx-auto w-full px-6 py-12">
      <h1 className="text-fd-foreground mb-2 text-2xl font-semibold tracking-tight">Graph View</h1>
      <p className="text-fd-muted-foreground mb-8 text-sm">
        Each node is a page. Edges are links between pages. Hover to see descriptions, click to
        navigate.
      </p>
      <GraphView graph={graph} />
    </div>
  );
}
