"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import { loc, localizedHref, type Locale } from "@/lib/i18n";
import { VideoBackdrop } from "./video-backdrop";

const WORK_IDS = ["volvo-energy", "collector-bank", "worldstream-vxlan"] as const;

function WorkCard({
  index,
  client,
  title,
  pitch,
  tech,
  href,
  reduced,
}: {
  index: number;
  client: string;
  title: string;
  pitch: string;
  tech: string[];
  href: string;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <Link href={href} className="block h-full">
        <motion.div
          whileHover={reduced ? undefined : { y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex h-full flex-col border border-[#4a443d] bg-[#211e1a] p-6 transition-colors hover:border-[#a31f2e] md:p-8"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-[#d94a58]">{client}</p>
          <h3
            className="mt-3 text-2xl text-[#f0ece8] md:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-[#d4ccc3]">{pitch}</p>
          <p className="mt-4 font-mono text-xs text-[#9a958e]">{tech.join(" · ")}</p>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function Work({ reduced }: { reduced: boolean }) {
  const t = useTranslations("cinematic");
  const locale = useLocale() as Locale;
  const cases = WORK_IDS.map((id) => projects.find((p) => p.id === id)!);
  const projectsHref = localizedHref("/projects", locale);

  return (
    <section className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <VideoBackdrop src="/media/stream.mp4" hidden={reduced} />
        <p className="relative z-10 mb-10 font-mono text-xs uppercase tracking-widest text-[#d94a58]">
          {t("workLabel")}
        </p>
        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-6 md:flex-row md:items-stretch md:justify-center">
          {cases.map((p, i) => (
            <WorkCard
              key={p.id}
              index={i}
              client={p.client}
              title={loc(p.title, locale)}
              pitch={loc(p.result, locale)}
              tech={p.tech.slice(0, 4)}
              href={projectsHref}
              reduced={reduced}
            />
          ))}
        </div>
        <Link
          href={projectsHref}
          className="relative z-10 mt-10 font-mono text-xs uppercase tracking-widest text-[#9a958e] transition-colors hover:text-[#f0ece8]"
        >
          {t("viewAll")} →
        </Link>
      </div>
    </section>
  );
}
