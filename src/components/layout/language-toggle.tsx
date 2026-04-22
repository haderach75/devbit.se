"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LOCALES, swapLocaleInPath, type Locale } from "@/lib/i18n";

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const current = useLocale() as Locale;
  const t = useTranslations("header");
  const other: Locale = current === "en" ? "sv" : "en";

  function toggle() {
    try {
      localStorage.setItem("locale", other);
    } catch {
      // localStorage unavailable — proceed anyway
    }
    const nextPath = swapLocaleInPath(pathname, other);
    router.replace(nextPath);
  }

  return (
    <button
      onClick={toggle}
      aria-label={t("toggleLanguage")}
      className="px-2 py-1 rounded-md border border-border text-xs font-mono font-medium text-text-muted hover:text-text-body hover:bg-surface transition-colors uppercase"
    >
      {LOCALES.filter((l) => l !== current).map((l) => l).join("")}
    </button>
  );
}
