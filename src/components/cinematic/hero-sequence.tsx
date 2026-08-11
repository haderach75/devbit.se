"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useTranslations } from "next-intl";

const FRAME_COUNT = 120;
const framePath = (i: number) => `/frames/orbit/frame-${String(i + 1).padStart(4, "0")}.webp`;
const POSTER = "/media/orbit-poster.webp";

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const { width: cw, height: ch } = ctx.canvas;
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
}

export function HeroSequence({ name, reduced }: { name: string; reduced: boolean }) {
  const t = useTranslations("cinematic");
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const [progress, setProgress] = useState(0); // preload progress 0..1
  const [mode, setMode] = useState<"loading" | "canvas" | "poster">("loading");

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  // Scrub the orbit over the whole pinned distance.
  const frame = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.55, 0.8], [1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0.55, 0.8], [0, -60]);

  // Preload the sequence — desktop with motion only. Phones and
  // reduced-motion users get the poster and never download a frame.
  useEffect(() => {
    if (reduced || window.matchMedia("(max-width: 767px)").matches) {
      setMode("poster");
      return;
    }
    let cancelled = false;
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];
    const onDone = (ok: boolean) => {
      loaded++;
      if (cancelled) return;
      setProgress(loaded / FRAME_COUNT);
      if (loaded === FRAME_COUNT) {
        // If the first frame failed, the sequence isn't there — fall back.
        setMode(imgs[0]?.naturalWidth ? "canvas" : "poster");
      }
      void ok;
    };
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.onload = () => onDone(true);
      img.onerror = () => onDone(false);
      img.src = framePath(i);
      imgs.push(img);
    }
    framesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, [reduced]);

  // Size canvas to viewport, redraw current frame.
  useEffect(() => {
    if (mode !== "canvas") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const render = () => {
      const img = framesRef.current[frameIndexRef.current];
      if (img?.naturalWidth) drawCover(ctx, img);
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      render();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [mode]);

  useMotionValueEvent(frame, "change", (v) => {
    const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(v)));
    if (idx === frameIndexRef.current) return;
    frameIndexRef.current = idx;
    const ctx = canvasRef.current?.getContext("2d");
    const img = framesRef.current[idx];
    if (ctx && img?.naturalWidth) drawCover(ctx, img);
  });

  const letters = name.toUpperCase().split("");

  return (
    <section ref={sectionRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {mode === "canvas" ? (
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={POSTER}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => ((e.target as HTMLImageElement).src = "/michael.jpg")}
          />
        )}
        {/* vignette so type stays readable over the clip */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714] via-transparent to-[#1a1714]/60" />

        {mode === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1a1714]">
            <p className="font-mono text-sm text-[#9a958e]">
              {t("loading")} {Math.round(progress * 100)}%
            </p>
          </div>
        )}

        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
        >
          <h1
            className="text-[13vw] leading-[0.95] tracking-tight md:text-[10vw]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.045, duration: 0.5, ease: "easeOut" }}
                className="inline-block"
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-6 max-w-xl text-base text-[#d4ccc3] md:text-lg"
          >
            {t("subtitle")}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="mt-4 font-mono text-xs text-[#a31f2e] md:text-sm"
          >
            {t("tag")}
          </motion.p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 2.5, duration: 2.5, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-widest text-[#9a958e]"
        >
          {t("scroll")} ↓
        </motion.p>
      </div>
    </section>
  );
}
