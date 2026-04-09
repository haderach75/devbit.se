"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { CareerEvent as CareerEventType } from "@/lib/types";
import { ProjectEvent } from "./project-event";

const typeStyles: Record<string, { color: string; border: string; dot: string }> = {
  RoleStarted: { color: "text-crimson", border: "border-border", dot: "bg-crimson/20 border-crimson" },
  EducationCompleted: { color: "text-purple", border: "border-purple/20", dot: "bg-purple/20 border-purple" },
  CompanyFounded: { color: "text-gold", border: "border-gold/20", dot: "bg-gold/20 border-gold" },
  SkillAcquired: { color: "text-amber", border: "border-amber/20", dot: "bg-amber/20 border-amber" },
};

interface CareerEventProps { event: CareerEventType; }

export function CareerEvent({ event }: CareerEventProps) {
  const [expanded, setExpanded] = useState(false);
  const style = typeStyles[event.type] ?? typeStyles.RoleStarted;
  const hasChildren = event.children && event.children.length > 0;

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.4 }}
      className={`relative border-l-2 ${style.border} pl-5 mb-6`}>
      <div className={`absolute -left-[5px] top-1 h-2 w-2 rounded-full border-2 ${style.dot}`} />
      <div className={hasChildren ? "cursor-pointer" : ""} onClick={() => hasChildren && setExpanded(!expanded)}>
        <div className="flex items-center gap-2">
          <p className={`font-mono text-xs font-semibold tracking-wide ${style.color}`}>{event.type}</p>
          {hasChildren && (
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={12} className="text-text-dim" />
            </motion.div>
          )}
        </div>
        <p className="font-mono text-xs text-text-dim mt-0.5">
          {event.timestamp}{event.endTimestamp && ` → ${event.endTimestamp}`}{" · "}{event.source}
        </p>
        <div className="font-mono text-xs text-text-muted mt-1 space-y-0.5">
          {event.payload.role && <p><span className="text-text-dim">role: </span><span className="text-text-body">&quot;{event.payload.role}&quot;</span></p>}
          {event.payload.domain && <p><span className="text-text-dim">domain: </span><span className="text-text-body">&quot;{event.payload.domain}&quot;</span></p>}
          {event.payload.tech && <p><span className="text-text-dim">tech: </span><span className="text-amber">[{event.payload.tech.map((t) => `"${t}"`).join(", ")}]</span></p>}
          {event.payload.degree && <p><span className="text-text-dim">degree: </span><span className="text-text-body">&quot;{event.payload.degree}&quot;</span></p>}
          {event.payload.status && <p><span className="text-text-dim">status: </span><span className="text-sage">&quot;{event.payload.status}&quot;</span></p>}
        </div>
      </div>
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-2 border-t border-dashed border-border">
            {event.children!.map((child) => <ProjectEvent key={child.id} event={child} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
