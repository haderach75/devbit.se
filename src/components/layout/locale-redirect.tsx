"use client";

import { useEffect } from "react";
import { DEFAULT_LOCALE, detectBrowserLocale, isLocale, type Locale } from "@/lib/i18n";

interface LocaleRedirectProps {
  preservePath?: boolean;
}

export function LocaleRedirect({ preservePath = false }: LocaleRedirectProps) {
  useEffect(() => {
    let target: Locale = DEFAULT_LOCALE;
    try {
      const stored = localStorage.getItem("locale");
      if (stored && isLocale(stored)) {
        target = stored;
      } else if (typeof navigator !== "undefined") {
        target = detectBrowserLocale(navigator.language);
      }
    } catch {
      // localStorage unavailable (private mode, SSR fallback) — stay on DEFAULT_LOCALE
    }

    let destination = `/${target}`;
    if (preservePath && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path && path !== "/") destination = `/${target}${path.replace(/\/$/, "")}`;
    }

    window.location.replace(destination);
  }, [preservePath]);

  return null;
}
