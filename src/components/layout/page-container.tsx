"use client";

import { motion } from "framer-motion";
import { FloatingSticky } from "./floating-sticky";

interface PageContainerProps {
  children: React.ReactNode;
  stickyLabel?: string;
  stickyRotation?: number;
}

export function PageContainer({ children, stickyLabel, stickyRotation }: PageContainerProps) {
  return (
    <>
      {stickyLabel && (
        <FloatingSticky label={stickyLabel} rotation={stickyRotation} />
      )}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto max-w-5xl px-4 pt-20 md:pt-24 pb-16 overflow-x-hidden">
        {children}
      </motion.main>
    </>
  );
}
