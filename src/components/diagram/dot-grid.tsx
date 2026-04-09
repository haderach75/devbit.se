"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export function DotGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useTransform(mouseX, [0, 1], [-5, 5]);
  const bgY = useTransform(mouseY, [0, 1], [-5, 5]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
