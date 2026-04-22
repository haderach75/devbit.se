"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/lib/i18n";
import { FloatingSticky } from "./floating-sticky";

type StickyKey = "services" | "career" | "projects" | "about" | "contact";

const stickyByRoute: Record<string, { key: StickyKey; rotation: number }> = {
  services: { key: "services", rotation: -0.5 },
  career:   { key: "career",   rotation: 1.5 },
  projects: { key: "projects", rotation: 0.5 },
  about:    { key: "about",    rotation: -1 },
  contact:  { key: "contact",  rotation: -0.5 },
};

interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const t = useTranslations("sticky");

  // pathname is like "/en/services" or "/sv/career/"
  const segments = pathname.split("/").filter(Boolean);
  const routeKey = segments[1]; // after the locale
  const sticky = routeKey ? stickyByRoute[routeKey] : undefined;

  return (
    <>
      {sticky && (
        <FloatingSticky label={t(sticky.key)} rotation={sticky.rotation} backLabel={t("back")} homeHref={`/${locale}`} />
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
