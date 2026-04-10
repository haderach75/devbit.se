"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FloatingSticky } from "./floating-sticky";

const pageStickies: Record<string, { label: string; rotation: number }> = {
  "/services": { label: "Services", rotation: -0.5 },
  "/career": { label: "Career Stream", rotation: 1.5 },
  "/projects": { label: "Projects", rotation: 0.5 },
  "/about": { label: "About", rotation: -1 },
  "/contact": { label: "Contact", rotation: -0.5 },
};

interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  const pathname = usePathname();
  const sticky = pageStickies[pathname];

  return (
    <>
      {sticky && (
        <FloatingSticky label={sticky.label} rotation={sticky.rotation} />
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
