"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LOCALES, swapLocaleInPath, type Locale } from "@/lib/i18n";

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const current = useLocale() as Locale;
  const t = useTranslations("header");

  function select(next: Locale) {
    if (next === current) return;
    try {
      localStorage.setItem("locale", next);
    } catch {
      // localStorage unavailable — proceed anyway
    }
    router.replace(swapLocaleInPath(pathname, next));
  }

  return (
    <div
      role="group"
      aria-label={t("toggleLanguage")}
      className="inline-flex items-center rounded-full border border-border bg-surface p-0.5 text-[11px] font-mono font-semibold tracking-widest uppercase"
    >
      {LOCALES.map((l) => {
        const active = l === current;
        return (
          <button
            key={l}
            type="button"
            onClick={() => select(l)}
            aria-pressed={active}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              active
                ? "bg-crimson text-white shadow-[0_1px_3px_rgba(163,31,46,0.35)]"
                : "text-text-muted hover:text-text-body"
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
