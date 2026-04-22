"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { Project } from "@/lib/types";
import { loc, type Locale } from "@/lib/i18n";
import { companyLogos } from "@/data/logos";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("project");
  const logoSrc = companyLogos[project.client];
  const logoHeight = logoSrc?.endsWith(".png") ? "h-6" : "h-4";

  const sections: { key: "challenge" | "approach" | "result"; label: string }[] = [
    { key: "challenge", label: t("sectionChallenge") },
    { key: "approach",  label: t("sectionApproach") },
    { key: "result",    label: t("sectionResult") },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2, borderColor: "#a31f2e" }}
      className="rounded-xl border border-border bg-surface p-4 md:p-6 transition-shadow hover:shadow-[0_4px_20px_rgba(163,31,46,0.08)]">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-text-primary text-sm md:text-base">{loc(project.title, locale)}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            {logoSrc && (
              <Image src={logoSrc} alt={project.client} width={80} height={20}
                className={`w-auto opacity-60 dark:opacity-90 dark:invert shrink-0 ${logoHeight}`} />
            )}
            <p className="text-sm md:text-base text-crimson">{project.client}</p>
          </div>
        </div>
        <span className="rounded-md border border-border bg-bg px-2 py-0.5 text-xs md:text-sm text-text-dim shrink-0">{loc(project.domain, locale)}</span>
      </div>
      <div className="space-y-3 text-sm md:text-base">
        {sections.map(({ key, label }, i) => (
          <motion.div key={key} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 + (i + 1) * 0.1 }}>
            <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-text-dim mb-1">{label}</p>
            <p className="text-text-muted">{loc(project[key], locale)}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.map((v, i) => (
          <motion.span key={v} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.2, delay: index * 0.1 + 0.4 + i * 0.05 }}
            className="rounded border border-crimson/20 bg-crimson/5 px-2 py-0.5 font-mono text-xs md:text-sm text-amber">{v}</motion.span>
        ))}
      </div>
    </motion.div>
  );
}
