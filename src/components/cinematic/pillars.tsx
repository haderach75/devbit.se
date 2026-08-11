"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { services } from "@/data/services";
import { loc, type Locale } from "@/lib/i18n";
import { VideoBackdrop } from "./video-backdrop";

const PILLAR_IDS = ["architecture", "development", "ai"] as const;
// Event Storming note colors, same values as the homepage board.
const NOTE = [
  { bg: "bg-[#FF8C42]", text: "text-[#3d1e00]", rotate: "-rotate-2" },
  { bg: "bg-[#5B9BD5]", text: "text-[#1a2e42]", rotate: "rotate-1" },
  { bg: "bg-[#FFD966]", text: "text-[#3d3000]", rotate: "-rotate-1" },
];

function PillarNote({
  index,
  title,
  description,
  reduced,
}: {
  index: number;
  title: string;
  description: string;
  reduced: boolean;
}) {
  const note = NOTE[index];

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
      className={`${note.bg} ${note.text} ${note.rotate} w-full max-w-sm p-6 shadow-xl md:p-8`}
    >
      <h3 className="text-2xl md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed md:text-base">{description}</p>
    </motion.div>
  );
}

export function Pillars({ reduced }: { reduced: boolean }) {
  const t = useTranslations("cinematic");
  const locale = useLocale() as Locale;
  const pillars = PILLAR_IDS.map((id) => services.find((s) => s.id === id)!);

  return (
    <section className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <VideoBackdrop src="/media/storm.mp4" hidden={reduced} />
        <p className="relative z-10 mb-10 font-mono text-xs uppercase tracking-widest text-[#d94a58]">
          {t("pillarsLabel")}
        </p>
        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-6 md:flex-row md:items-stretch md:justify-center">
          {pillars.map((service, i) => (
            <PillarNote
              key={service.id}
              index={i}
              title={loc(service.title, locale)}
              description={loc(service.description, locale)}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
