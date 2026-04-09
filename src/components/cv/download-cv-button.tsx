"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export function DownloadCvButton() {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { CvDocument } = await import("./cv-document");
      const { cvData } = await import("@/data/cv-data");
      const blob = await pdf(<CvDocument data={cvData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "michael-hultman-cv.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="mb-8 inline-flex items-center gap-2 rounded-lg border border-crimson/30 bg-crimson/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-crimson hover:bg-crimson/20 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      {loading ? "Generating..." : "Download CV as PDF"}
    </button>
  );
}
