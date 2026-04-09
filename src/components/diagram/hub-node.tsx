"use client";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";

export function HubNode() {
  return (
    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center gap-3 rounded-xl border-2 border-crimson bg-gradient-to-br from-[#1e120f] to-bg px-6 py-4 shadow-[0_0_40px_rgba(163,31,46,0.12)]">
      <div className="clip-hexagon flex h-12 w-12 items-center justify-center bg-crimson">
        <div className="clip-hexagon flex h-10 w-10 items-center justify-center bg-[#1e120f]">
          <span className="font-mono text-xs font-semibold text-crimson">&lt;/&gt;</span>
        </div>
      </div>
      <div>
        <div className="text-xl font-bold tracking-wider text-text-primary">DEVBIT</div>
        <div className="text-xs font-medium tracking-widest text-crimson">consulting</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-crimson !border-none !w-2 !h-2" />
    </motion.div>
  );
}
