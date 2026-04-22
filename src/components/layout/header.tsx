"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { siteLinks } from "@/data/site-config";
import { loc, localizedHref, type Locale } from "@/lib/i18n";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";

export function Header() {
  const pathname = usePathname();
  const locale = useLocale() as Locale;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
          <Image src="/logo-icon.svg" alt="" width={36} height={36} className="h-9 w-9" />
          <div className="flex flex-col leading-none">
            <span className="text-xl tracking-[0.12em] text-text-primary" style={{ fontFamily: "var(--font-logo), serif" }}>DEVBIT</span>
            <span className="text-[11px] font-medium tracking-[0.15em] text-crimson">consulting</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            {siteLinks.map((link) => {
              const href = localizedHref(link.href, locale);
              const active = pathname === href || pathname === `${href}/`;
              return (
                <Link key={link.href} href={href}
                  className={`text-base transition-colors ${active ? "text-crimson font-medium" : "text-text-muted hover:text-text-body"}`}>
                  {loc(link.label, locale)}
                </Link>
              );
            })}
          </nav>
          <LanguageToggle />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
