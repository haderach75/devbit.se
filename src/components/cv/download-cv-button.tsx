"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/lib/i18n";

interface DownloadCvButtonProps {
  variant?: "full" | "broker";
}

export function DownloadCvButton({ variant = "full" }: DownloadCvButtonProps) {
  const [loading, setLoading] = useState(false);
  const locale = useLocale() as Locale;
  const tAbout = useTranslations("about");
  const tCv = useTranslations("cv");
  const isBroker = variant === "broker";

  async function handleDownload() {
    setLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { CvDocument } = await import("./cv-document");
      const { buildCvData } = await import("@/data/cv-data");

      const data = buildCvData(locale);
      const labels = {
        experience: tCv("experience"),
        education: tCv("education"),
        skills: tCv("skills"),
        languages: tCv("languages"),
        employed: tCv("employed"),
        consulting: tCv("consulting"),
        linkedinProfile: tCv("linkedinProfile"),
        at: tCv("at"),
        consultingVia: (company: string) => tCv("consultingVia", { company }),
        present: tCv("present"),
      };

      const blob = await pdf(
        <CvDocument data={data} labels={labels} omitContact={isBroker} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = isBroker
        ? `michael-hultman-cv-broker-${locale}.pdf`
        : `michael-hultman-cv-${locale}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  }

  const label = isBroker ? tAbout("downloadCvBroker") : tAbout("downloadCv");

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="mb-8 inline-flex items-center gap-2 rounded-lg border border-crimson/30 bg-crimson/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-crimson hover:bg-crimson/20 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      {loading ? tAbout("downloadGenerating") : label}
    </button>
  );
}
