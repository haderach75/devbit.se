"use client";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-text-primary">{project.title}</h3>
          <p className="text-sm text-crimson">{project.client}</p>
        </div>
        <span className="rounded-md border border-border bg-bg px-2 py-0.5 text-xs text-text-dim">{project.domain}</span>
      </div>
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-text-dim mb-1">Challenge</p>
          <p className="text-text-muted">{project.challenge}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-text-dim mb-1">Approach</p>
          <p className="text-text-muted">{project.approach}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-text-dim mb-1">Result</p>
          <p className="text-text-muted">{project.result}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span key={t} className="rounded border border-crimson/20 bg-crimson/5 px-2 py-0.5 font-mono text-xs text-amber">{t}</span>
        ))}
      </div>
    </motion.div>
  );
}
