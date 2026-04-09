"use client";

import Image from "next/image";
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
        <Link href="/" className="flex items-center group">
          <Image src="/logo.svg" alt="Devbit Consulting" width={180} height={76} className="h-8 w-auto" />
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
