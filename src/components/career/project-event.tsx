"use client";
import { motion } from "framer-motion";
import type { CareerEvent } from "@/lib/types";

interface ProjectEventProps { event: CareerEvent; }

export function ProjectEvent({ event }: ProjectEventProps) {
  const color = event.type === "ProjectInProgress" ? "text-amber" : "text-sage";
  const borderColor = event.type === "ProjectInProgress" ? "border-amber/30" : "border-sage/30";
  const dotBg = event.type === "ProjectInProgress" ? "bg-amber/20 border-amber" : "bg-sage/20 border-sage";

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
      className={`relative border-l border-dashed ${borderColor} pl-5 mb-3`}>
      <div className={`absolute -left-[5px] top-1 h-2 w-2 rounded-full border-2 ${dotBg}`} />
      <p className={`font-mono text-sm font-semibold tracking-wide ${color}`}>{event.type}</p>
      <p className="font-mono text-sm text-text-dim">{event.source}</p>
      <p className="font-mono text-sm text-text-muted mt-0.5">
        <span className="text-text-dim">scope: </span>
        <span className="text-text-body">&quot;{event.payload.scope}&quot;</span>
      </p>
    </motion.div>
  );
}
