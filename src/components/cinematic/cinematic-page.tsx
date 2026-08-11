"use client";

import { useEffect, useSyncExternalStore } from "react";
import Lenis from "lenis";
import { HeroSequence } from "./hero-sequence";
import { StatsStrip } from "./stats-strip";
import { Pillars } from "./pillars";
import { Work } from "./work";
import { Finale } from "./finale";

export interface CinematicStats {
  years: number;
  systems: number;
  clients: number;
  founded: number;
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false
  );
}

// SVG noise, inlined so the grain overlay needs no asset.
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='128' height='128' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E";

export function CinematicPage({
  stats,
  name,
  linkedin,
}: {
  stats: CinematicStats;
  name: string;
  linkedin: string;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative bg-[#1a1714] text-[#f0ece8]">
      <HeroSequence name={name} reduced={reduced} />
      <StatsStrip stats={stats} reduced={reduced} />
      <Pillars reduced={reduced} />
      <Work reduced={reduced} />
      <Finale linkedin={linkedin} />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN}")` }}
      />
    </main>
  );
}
