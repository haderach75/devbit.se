"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { companyLogos } from "@/data/logos";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl border border-border bg-surface p-4 md:p-6">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-text-primary text-sm md:text-base">{project.title}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            {companyLogos[project.client] && (
              <Image src={companyLogos[project.client]} alt={project.client} width={80} height={20} className="h-4 w-auto opacity-60 shrink-0" />
            )}
            <p className="text-sm md:text-base text-crimson">{project.client}</p>
          </div>
        </div>
        <span className="rounded-md border border-border bg-bg px-2 py-0.5 text-xs md:text-sm text-text-dim shrink-0">{project.domain}</span>
      </div>
      <div className="space-y-3 text-sm md:text-base">
        <div>
          <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-text-dim mb-1">Challenge</p>
          <p className="text-text-muted">{project.challenge}</p>
        </div>
        <div>
          <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-text-dim mb-1">Approach</p>
          <p className="text-text-muted">{project.approach}</p>
        </div>
        <div>
          <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-text-dim mb-1">Result</p>
          <p className="text-text-muted">{project.result}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span key={t} className="rounded border border-crimson/20 bg-crimson/5 px-2 py-0.5 font-mono text-xs md:text-sm text-amber">{t}</span>
        ))}
      </div>
    </motion.div>
  );
}
