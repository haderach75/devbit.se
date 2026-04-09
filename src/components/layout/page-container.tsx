"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto max-w-5xl px-4 pt-24 pb-16">
      <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm font-mono text-crimson hover:text-crimson-hover transition-colors">
        <ArrowLeft size={14} />
        back to diagram
      </Link>
      {children}
    </motion.main>
  );
}
