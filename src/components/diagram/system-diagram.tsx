"use client";
import { useMemo } from "react";
import { ReactFlow, type Node, type Edge, ConnectionLineType, useNodesState, useEdgesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { HubNode } from "./hub-node";
import { SectionNode } from "./section-node";
import { AnimatedEdge } from "./animated-edge";
import { siteLinks } from "@/data/site-config";

const nodeTypes = { hub: HubNode, section: SectionNode };
const edgeTypes = { animated: AnimatedEdge };

function buildNodes(): Node[] {
  const hub: Node = { id: "hub", type: "hub", position: { x: 350, y: 50 }, data: {}, draggable: false };
  const positions = [
    { x: 0, y: 250 }, { x: 190, y: 250 }, { x: 380, y: 250 }, { x: 570, y: 250 }, { x: 760, y: 250 },
  ];
  const sections: Node[] = siteLinks.map((link, i) => ({
    id: link.href, type: "section", position: positions[i],
    data: { label: link.label, description: link.description, icon: link.icon, href: link.href, index: i },
    draggable: false,
  }));
  return [hub, ...sections];
}

function buildEdges(): Edge[] {
  return siteLinks.map((link) => ({ id: `hub-${link.href}`, source: "hub", target: link.href, type: "animated" }));
}

export function SystemDiagram() {
  const initialNodes = useMemo(() => buildNodes(), []);
  const initialEdges = useMemo(() => buildEdges(), []);
  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <div className="h-screen w-full">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes}
        connectionLineType={ConnectionLineType.SmoothStep} fitView fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        panOnDrag={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false}
        preventScrolling={false} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}>
      </ReactFlow>
    </div>
  );
}
