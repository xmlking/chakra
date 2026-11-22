// oxlint-disable react-doctor/react-compiler-no-manual-memoization
"use client";
import { navigate } from "astro:transitions/client";
import { forceCollide, forceLink, forceManyBody } from "d3-force";
import {
  lazy,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type {
  ForceGraphMethods,
  ForceGraphProps,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";

export interface Graph {
  links: Link[];
  nodes: Node[];
}

export type Node = NodeObject<NodeType>;
export type Link = LinkObject<NodeType, LinkType>;

export interface NodeType {
  text: string;
  description?: string;
  neighbors?: string[];
  url: string;
}

export type LinkType = Record<string, unknown>;

export interface GraphViewProps {
  graph: Graph;
}

const ForceGraph2D = lazy(
  () => import("react-force-graph-2d"),
) as typeof import("react-force-graph-2d").default;

function useIsHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** the content size of `ref`, the canvas defaults to the window size without it */
function useElementSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState<{ width: number; height: number }>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

export function GraphView(props: GraphViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHydrated = useIsHydrated();

  return (
    <div
      ref={ref}
      className="bg-fd-background relative min-h-[400px] flex-1 overflow-hidden rounded-xl border"
    >
      {isHydrated && <ClientOnly {...props} containerRef={ref} />}
    </div>
  );
}

function ClientOnly({
  containerRef,
  graph,
}: GraphViewProps & { containerRef: RefObject<HTMLDivElement | null> }) {
  const graphRef = useRef<ForceGraphMethods<Node, Link> | undefined>(undefined);
  const hoveredRef = useRef<Node | null>(null);
  const fittedRef = useRef(false);
  const size = useElementSize(containerRef);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);

  const handleNodeHover = (node: Node | null) => {
    const graph = graphRef.current;
    if (!graph) return;
    hoveredRef.current = node;

    if (node) {
      const coords = graph.graph2ScreenCoords(node.x!, node.y!);
      setTooltip({
        x: coords.x + 4,
        y: coords.y + 4,
        content: node.description ?? "No description",
      });
    } else {
      setTooltip(null);
    }
  };

  // Custom node rendering: circle with text label below
  const nodeCanvasObject: ForceGraphProps["nodeCanvasObject"] = (node, ctx) => {
    const container = containerRef.current;
    if (!container) return;
    const style = getComputedStyle(container);
    const fontSize = 14;
    const radius = 5;

    // Draw circle
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);

    const hoverNode = hoveredRef.current;
    const isActive = hoverNode?.id === node.id || hoverNode?.neighbors?.includes(node.id as string);

    ctx.fillStyle = isActive
      ? style.getPropertyValue("--color-fd-primary")
      : style.getPropertyValue("--color-purple-300");
    ctx.fill();

    // Draw text below the node
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = getComputedStyle(container).getPropertyValue("color");
    ctx.fillText(node.text, node.x!, node.y! + radius + fontSize);
  };

  const linkColor = (link: Link) => {
    const container = containerRef.current;
    if (!container) return "#999";
    const style = getComputedStyle(container);
    const hoverNode = hoveredRef.current;

    if (
      hoverNode &&
      typeof link.source === "object" &&
      typeof link.target === "object" &&
      (hoverNode.id === link.source.id || hoverNode.id === link.target.id)
    ) {
      return style.getPropertyValue("--color-fd-primary");
    }

    return `color-mix(in oklab, ${style.getPropertyValue("--color-fd-muted-foreground")} 50%, transparent)`;
  };

  // Enrich nodes with neighbors for hover effects
  const enrichedNodes = useMemo(() => {
    const { nodes, links } = structuredClone(graph);
    for (const node of nodes) {
      node.neighbors = links.flatMap((link) => {
        if (link.source === node.id) return link.target as string;
        if (link.target === node.id) return link.source as string;
        return [];
      });
    }

    return {
      nodes,
      links,
    };
  }, [graph]);

  if (!size) return null;

  return (
    <>
      <ForceGraph2D<NodeType, LinkType>
        ref={{
          get current() {
            return graphRef.current;
          },
          set current(fg) {
            graphRef.current = fg;
            if (fg) {
              fg.d3Force("link", forceLink().distance(200));
              fg.d3Force("charge", forceManyBody().strength(10));
              fg.d3Force("collision", forceCollide(60));
            }
          },
        }}
        width={size.width}
        height={size.height}
        // fit every node once the first layout settles, later drags keep the user's zoom
        onEngineStop={() => {
          if (fittedRef.current) return;
          fittedRef.current = true;
          graphRef.current?.zoomToFit(400, 40);
        }}
        graphData={enrichedNodes}
        nodeCanvasObject={nodeCanvasObject}
        linkColor={linkColor}
        onNodeHover={handleNodeHover}
        onNodeClick={async (node) => {
          // page URLs have no base path
          await navigate(`${import.meta.env.BASE_URL.replace(/\/$/, "")}${node.url}`);
        }}
        linkWidth={2}
        enableNodeDrag
        enableZoomInteraction
      />
      {tooltip && (
        <div
          className="bg-fd-popover text-fd-popover-foreground absolute size-fit max-w-xs rounded-xl border p-2 text-sm shadow-lg"
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          {tooltip.content}
        </div>
      )}
    </>
  );
}
