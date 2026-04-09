"use client";
import { motion } from "framer-motion";
import { Cpu, Code, Cloud, MessageSquare } from "lucide-react";
import type { Service } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = { Cpu, Code, Cloud, MessageSquare };

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = iconMap[service.icon] ?? Cpu;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2, borderColor: "#a31f2e" }}
      className="rounded-xl border border-border bg-bg p-5 transition-shadow hover:shadow-[0_4px_20px_rgba(163,31,46,0.08)]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10">
        <Icon size={20} className="text-crimson" />
      </div>
      <h3 className="text-sm font-semibold text-text-body mb-1">{service.title}</h3>
      <p className="text-sm leading-relaxed text-text-dim">{service.description}</p>
    </motion.div>
  );
}
