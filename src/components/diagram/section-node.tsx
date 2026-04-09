"use client";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Settings, ScrollText, Star, User, Mail } from "lucide-react";

const iconMap: Record<string, React.ElementType> = { Settings, ScrollText, Star, User, Mail };

interface SectionNodeData {
  label: string;
  description: string;
  icon: string;
  href: string;
  index: number;
}

export function SectionNode({ data }: { data: SectionNodeData }) {
  const router = useRouter();
  const Icon = iconMap[data.icon] ?? Settings;

  return (
    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 + data.index * 0.1, ease: "easeOut" }}
      onClick={() => router.push(data.href)}
      className="group cursor-pointer rounded-xl border border-border bg-surface p-5 text-center transition-all duration-300 hover:border-crimson hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(163,31,46,0.08)] w-[155px]">
      <div className="clip-hexagon mx-auto mb-3 flex h-9 w-9 items-center justify-center bg-crimson/10">
        <Icon size={16} className="text-crimson" />
      </div>
      <div className="text-sm font-semibold text-text-body">{data.label}</div>
      <div className="mt-1 text-[11px] leading-snug text-text-dim">{data.description}</div>
      <Handle type="target" position={Position.Top} className="!bg-crimson !border-none !w-2 !h-2" />
    </motion.div>
  );
}
