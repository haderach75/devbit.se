"use client";

import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { contactInfo } from "@/data/site-config";
import { DownloadCvButton } from "@/components/cv/download-cv-button";
import { loc, type Locale } from "@/lib/i18n";

export function Finale({ linkedin }: { linkedin: string }) {
  const t = useTranslations("cinematic");
  const locale = useLocale() as Locale;

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20% 0px" }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl text-5xl leading-[1.05] text-[#f0ece8] md:text-7xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {t("finaleTitle")}
      </motion.h2>

      <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
        <a
          href={`mailto:${contactInfo.email}`}
          className="inline-flex items-center gap-2 bg-[#a31f2e] px-6 py-3 text-sm font-medium text-[#f0ece8] transition-colors hover:bg-[#8a1a27]"
        >
          <Mail size={16} />
          {t("bookCall")}
        </a>
        <div className="[&>button]:mb-0">
          <DownloadCvButton />
        </div>
      </div>

      <p className="mt-8 max-w-md text-sm text-[#9a958e]">{loc(contactInfo.availability, locale)}</p>

      <footer className="mt-16 flex items-center gap-8 font-mono text-xs text-[#9a958e]">
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-[#f0ece8]"
        >
          LinkedIn ↗
        </a>
        <a
          href={`mailto:${contactInfo.email}`}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-[#f0ece8]"
        >
          <Mail size={14} /> {contactInfo.email}
        </a>
        <a
          href={`tel:${contactInfo.phone.replace(/[^+\d]/g, "")}`}
          className="hidden items-center gap-1.5 transition-colors hover:text-[#f0ece8] sm:inline-flex"
        >
          <Phone size={14} /> {contactInfo.phone}
        </a>
      </footer>
    </section>
  );
}
