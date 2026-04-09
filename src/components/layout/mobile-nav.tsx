"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { siteLinks } from "@/data/site-config";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-text-muted hover:text-text-body" aria-label="Toggle menu">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-0 right-0 border-b border-border bg-bg/95 backdrop-blur-md">
            <nav className="flex flex-col p-4 gap-1">
              {siteLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm transition-colors ${pathname === link.href ? "bg-surface text-crimson font-medium" : "text-text-muted hover:bg-surface hover:text-text-body"}`}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
