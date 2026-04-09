"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteLinks } from "@/data/site-config";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/logo-icon.svg" alt="" width={36} height={36} className="h-9 w-9" />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-widest text-text-primary">DEVBIT</span>
            <span className="text-[11px] font-medium tracking-[0.15em] text-crimson">consulting</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            {siteLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-base transition-colors ${pathname === link.href ? "text-crimson font-medium" : "text-text-muted hover:text-text-body"}`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
