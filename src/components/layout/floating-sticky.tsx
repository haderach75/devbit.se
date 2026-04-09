"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface FloatingStickyProps {
  label: string;
  rotation?: number;
}

const pageStickies: Record<string, { label: string; rotation: number }> = {
  "/services": { label: "Services", rotation: -0.5 },
  "/career": { label: "Career Stream", rotation: 1.5 },
  "/projects": { label: "Projects", rotation: 0.5 },
  "/about": { label: "About", rotation: -1 },
  "/contact": { label: "Contact", rotation: -0.5 },
};

export function FloatingSticky({ label, rotation = 3 }: FloatingStickyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: rotation + 15 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ scale: 1.1, rotate: 0 }}
      className="fixed z-40
        top-20 right-4 w-[65px] h-[65px] text-[13px]
        md:top-20 md:right-8 md:w-[75px] md:h-[75px] md:text-sm
        max-[480px]:w-[48px] max-[480px]:h-[48px] max-[480px]:text-[10px] max-[480px]:top-16 max-[480px]:right-2"
    >
      <Link href="/" className="block w-full h-full">
        <div
          className="w-full h-full bg-[#FFD966] text-[#3d3000] border-2 border-white/30 rounded-sm flex flex-col items-center justify-center text-center font-semibold cursor-pointer"
          style={{
            fontFamily: "'Caveat', 'Segoe Print', 'Comic Sans MS', cursive",
            boxShadow: "3px 4px 8px rgba(0,0,0,0.18), 1px 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <span>{label}</span>
          <span className="text-[8px] md:text-[9px] opacity-50 font-sans font-normal mt-0.5">← back</span>
        </div>
      </Link>
    </motion.div>
  );
}

export { pageStickies };
