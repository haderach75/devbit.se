"use client";
import { useEffect, useSyncExternalStore } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const emptySubscribe = () => () => {};

export function DotGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [0, 1], [-5, 5]);
  const bgY = useTransform(mouseY, [0, 1], [-5, 5]);
  // true after hydration, false during SSR/first client render
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  if (!mounted) return <div className="absolute inset-0 dot-grid opacity-50" />;
  return <motion.div className="absolute inset-0 dot-grid opacity-50" style={{ x: bgX, y: bgY }} />;
}
