"use client";
import dynamic from "next/dynamic";

export const SystemDiagramClient = dynamic(
  () => import("./system-diagram").then((m) => m.SystemDiagram),
  { ssr: false }
);
