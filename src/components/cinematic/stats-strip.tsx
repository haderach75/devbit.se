"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import type { CinematicStats } from "./cinematic-page";

function CountUp({ to, started, suffix = "" }: { to: number; started: boolean; suffix?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    let raf: number;
    const t0 = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3)))); // ease-out cubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, to]);
  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

export function StatsStrip({ stats, reduced }: { stats: CinematicStats; reduced: boolean }) {
  const t = useTranslations("cinematic.stats");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const started = reduced || inView;

  const items = [
    { value: stats.years, suffix: "+", label: t("years") },
    { value: stats.systems, suffix: "", label: t("systems") },
    { value: stats.clients, suffix: "", label: t("clients") },
    { value: stats.founded, suffix: "", label: t("founded") },
  ];

  return (
    <section ref={ref} className="border-y border-[#3a3530] bg-[#22201b] py-16 md:py-24">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 px-6 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <p
              className="text-5xl text-[#f0ece8] md:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {reduced ? (
                <span>
                  {item.value}
                  {item.suffix}
                </span>
              ) : (
                <CountUp to={item.value} started={started} suffix={item.suffix} />
              )}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-[#9a958e]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
