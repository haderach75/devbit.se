"use client";
import { motion } from "framer-motion";
import { Cpu, Code, Cloud, MessageSquare } from "lucide-react";
import { useLocale } from "next-intl";
import type { Service } from "@/lib/types";
import { loc, type Locale } from "@/lib/i18n";

const iconMap: Record<string, React.ElementType> = { Cpu, Code, Cloud, MessageSquare };

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const locale = useLocale() as Locale;
  const Icon = iconMap[service.icon] ?? Cpu;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2, borderColor: "#a31f2e" }}
      className="rounded-xl border border-border bg-bg p-5 transition-shadow hover:shadow-[0_4px_20px_rgba(163,31,46,0.08)]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-crimson/25 bg-crimson/10">
        <Icon size={20} className="text-crimson" />
      </div>
      <h3 className="text-sm md:text-base font-semibold text-text-body mb-1">{loc(service.title, locale)}</h3>
      <p className="text-sm md:text-base leading-relaxed text-text-dim">{loc(service.description, locale)}</p>
    </motion.div>
  );
}
