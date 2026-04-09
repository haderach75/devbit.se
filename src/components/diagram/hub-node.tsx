"use client";
import Image from "next/image";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";

export function HubNode() {
  return (
    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center gap-3 rounded-xl border-2 border-crimson bg-surface px-6 py-4 shadow-[0_0_40px_rgba(163,31,46,0.1)]">
      <Image src="/logo.svg" alt="Devbit Consulting" width={200} height={85} className="h-12 w-auto" priority />
      <Handle type="source" position={Position.Bottom} className="!bg-crimson !border-none !w-2 !h-2" />
    </motion.div>
  );
}
