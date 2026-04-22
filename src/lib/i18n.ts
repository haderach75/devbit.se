export type Locale = "en" | "sv";

export const LOCALES: readonly Locale[] = ["en", "sv"] as const;

export const DEFAULT_LOCALE: Locale = "en";

export type LocalizedString = { en: string; sv: string };

export function loc(value: LocalizedString, locale: Locale): string {
  return value[locale];
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localizedHref(href: string, locale: Locale): string {
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }
  const clean = href.startsWith("/") ? href : `/${href}`;
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}

export function swapLocaleInPath(pathname: string, nextLocale: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${nextLocale}`;
  if (isLocale(parts[0])) parts[0] = nextLocale;
  else parts.unshift(nextLocale);
  return "/" + parts.join("/");
}

export function detectBrowserLocale(navigatorLanguage: string | undefined | null): Locale {
  if (!navigatorLanguage) return DEFAULT_LOCALE;
  return navigatorLanguage.toLowerCase().startsWith("sv") ? "sv" : "en";
}
