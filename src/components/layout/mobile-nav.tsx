"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { siteLinks } from "@/data/site-config";
import { loc, localizedHref, type Locale } from "@/lib/i18n";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const t = useTranslations("header");

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-text-muted hover:text-text-body" aria-label={t("toggleMenu")}>
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
              {siteLinks.map((link) => {
                const href = localizedHref(link.href, locale);
                const active = pathname === href || pathname === `${href}/`;
                return (
                  <Link key={link.href} href={href} onClick={() => setIsOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm transition-colors ${active ? "bg-surface text-crimson font-medium" : "text-text-muted hover:bg-surface hover:text-text-body"}`}>
                    {loc(link.label, locale)}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
