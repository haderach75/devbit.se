"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { CareerEvent } from "@/lib/types";
import { loc, type Locale } from "@/lib/i18n";

interface ProjectEventProps { event: CareerEvent; locale: Locale; }

export function ProjectEvent({ event, locale }: ProjectEventProps) {
  const t = useTranslations("career");
  const color = event.type === "ProjectInProgress" ? "text-amber" : "text-sage";
  const borderColor = event.type === "ProjectInProgress" ? "border-amber/30" : "border-sage/30";
  const dotBg = event.type === "ProjectInProgress" ? "bg-amber/20 border-amber" : "bg-sage/20 border-sage";

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
      className={`relative border-l border-dashed ${borderColor} pl-5 mb-3`}>
      <div className={`absolute -left-[5px] top-1 h-2 w-2 rounded-full border-2 ${dotBg}`} />
      <p className={`font-mono text-xs md:text-sm font-semibold tracking-wide ${color}`}>{event.type}</p>
      <p className="font-mono text-xs md:text-sm text-text-dim">{event.source}</p>
      <p className="font-mono text-xs md:text-sm text-text-muted mt-0.5 break-words">
        <span className="text-text-dim">{t("fieldScope")}: </span>
        <span className="text-text-body">&quot;{event.payload.scope ? loc(event.payload.scope, locale) : ""}&quot;</span>
      </p>
    </motion.div>
  );
}
