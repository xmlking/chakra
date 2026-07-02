import { createFileRoute } from "@tanstack/react-router";
import { Canvas } from "@workspace/ui/components/ai-elements/canvas";
import { Edge } from "@workspace/ui/components/ai-elements/edge";
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@workspace/ui/components/ai-elements/node";

const nodeIds = {
  decision: "decision",
  output1: "output1",
  output2: "output2",
  process1: "process1",
  process2: "process2",
  start: "start",
};

const nodes = [
  {
    data: {
      description: "Initialize workflow",
      handles: { source: true, target: false },
      label: "Start",
    },
    id: nodeIds.start,
    position: { x: 0, y: 0 },
    type: "workflow",
  },
  {
    data: {
      description: "Transform input",
      handles: { source: true, target: true },
      label: "Process Data",
    },
    id: nodeIds.process1,
    position: { x: 500, y: 0 },
    type: "workflow",
  },
  {
    data: {
      description: "Route based on conditions",
      handles: { source: true, target: true },
      label: "Decision Point",
    },
    id: nodeIds.decision,
    position: { x: 1000, y: 0 },
    type: "workflow",
  },
  {
    data: {
      description: "Handle success case",
      handles: { source: true, target: true },
      label: "Success Path",
    },
    id: nodeIds.output1,
    position: { x: 1500, y: -100 },
    type: "workflow",
  },
  {
    data: {
      description: "Handle error case",
      handles: { source: true, target: true },
      label: "Error Path",
    },
    id: nodeIds.output2,
    position: { x: 1500, y: 100 },
    type: "workflow",
  },
  {
    data: {
      description: "Finalize workflow",
      handles: { source: false, target: true },
      label: "Complete",
    },
    id: nodeIds.process2,
    position: { x: 2000, y: 0 },
    type: "workflow",
  },
];

const edges = [
  {
    id: "edge-1",
    source: nodeIds.start,
    target: nodeIds.process1,
    type: "animated",
  },
  {
    id: "edge-2",
    source: nodeIds.process1,
    target: nodeIds.decision,
    type: "animated",
  },
  {
    id: "edge-3",
    source: nodeIds.decision,
    target: nodeIds.output1,
    type: "animated",
  },
  {
    id: "edge-4",
    source: nodeIds.decision,
    target: nodeIds.output2,
    type: "temporary",
  },
  {
    id: "edge-5",
    source: nodeIds.output1,
    target: nodeIds.process2,
    type: "animated",
  },
  {
    id: "edge-6",
    source: nodeIds.output2,
    target: nodeIds.process2,
    type: "temporary",
  },
];

const nodeTypes = {
  workflow: ({
    data,
  }: {
    data: {
      label: string;
      description: string;
      handles: { target: boolean; source: boolean };
    };
  }) => (
    <Node handles={data.handles}>
      <NodeHeader>
        <NodeTitle>{data.label}</NodeTitle>
        <NodeDescription>{data.description}</NodeDescription>
      </NodeHeader>
      <NodeContent>
        <p>test content</p>
      </NodeContent>
      <NodeFooter>
        <p>test footer</p>
      </NodeFooter>
    </Node>
  ),
};

const edgeTypes = {
  animated: Edge.Animated,
  temporary: Edge.Temporary,
};

export const Route = createFileRoute("/(app)/playground/workflow")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Canvas edges={edges} edgeTypes={edgeTypes} fitView nodes={nodes} nodeTypes={nodeTypes} />;
}
