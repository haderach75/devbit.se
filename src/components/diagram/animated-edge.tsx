"use client";
import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

export function AnimatedEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: EdgeProps) {
  const [edgePath] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, borderRadius: 20 });

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ stroke: "#ddd5cb", strokeWidth: 1.5 }} />
      <circle r="3" fill="#a31f2e">
        <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
      </circle>
      <circle r="3" fill="#a31f2e" opacity="0.4">
        <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} begin="1.5s" />
      </circle>
    </>
  );
}
