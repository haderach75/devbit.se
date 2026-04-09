"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteLinks } from "@/data/site-config";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  if (isHome) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <svg className="h-7 w-7" viewBox="0 0 48 48">
            <polygon points="24,2 44,14 44,34 24,46 4,34 4,14" fill="none" stroke="currentColor" strokeWidth="2" className="text-crimson" />
          </svg>
          <span className="text-sm font-semibold text-text-primary tracking-wide">DEVBIT</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {siteLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`text-sm transition-colors ${pathname === link.href ? "text-crimson font-medium" : "text-text-muted hover:text-text-body"}`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}
