"use client";

import { useLocale, useTranslations } from "next-intl";
import { careerEvents } from "@/data/career-events";
import type { Locale } from "@/lib/i18n";
import { CareerEvent } from "./career-event";

export function EventStream() {
  const locale = useLocale() as Locale;
  const t = useTranslations("career");
  const firstExpandableId = careerEvents.find((e) => e.children && e.children.length > 0)?.id;

  return (
    <div className="rounded-xl border border-border bg-bg p-3 md:p-6 font-mono overflow-x-hidden">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <div className="h-2 w-2 rounded-full bg-amber animate-pulse shrink-0" />
        <span className="text-xs md:text-sm text-text-dim">{t("streamHeader", { count: careerEvents.length })}</span>
      </div>
      <div className="space-y-2">
        {careerEvents.map((event) => (
          <CareerEvent key={event.id} event={event} locale={locale} defaultExpanded={event.id === firstExpandableId} />
        ))}
      </div>
    </div>
  );
}
