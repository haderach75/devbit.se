"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Settings, ScrollText, Star, User, Mail } from "lucide-react";
import { siteLinks } from "@/data/site-config";

const iconMap: Record<string, React.ElementType> = { Settings, ScrollText, Star, User, Mail };

export function MobileDiagram() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="mb-8 rounded-xl border-2 border-crimson bg-surface px-6 py-4 shadow-[0_0_40px_rgba(163,31,46,0.1)]">
        <Image src="/logo.svg" alt="Devbit Consulting" width={200} height={85} className="h-12 w-auto" priority />
      </motion.div>
      <div className="mb-4 h-8 w-px bg-gradient-to-b from-crimson to-crimson/20" />
      <div className="flex w-full max-w-sm flex-col gap-3">
        {siteLinks.map((link, i) => {
          const Icon = iconMap[link.icon] ?? Settings;
          return (
            <motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
              <Link href={link.href}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-all hover:border-crimson hover:shadow-[0_4px_20px_rgba(163,31,46,0.08)]">
                <div className="clip-hexagon flex h-9 w-9 shrink-0 items-center justify-center bg-crimson/10">
                  <Icon size={16} className="text-crimson" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-body">{link.label}</p>
                  <p className="text-xs text-text-dim">{link.description}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
