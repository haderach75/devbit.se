import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EventStormingBoard } from "@/components/eventstorming/board";
import { MobileEventStormingBoard } from "@/components/eventstorming/mobile-board";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://devbit.se/${locale}/board`,
      languages: { en: "/en/board", sv: "/sv/board" },
    },
  };
}

export default async function BoardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="hidden md:block">
        <EventStormingBoard />
      </div>
      <div className="md:hidden">
        <MobileEventStormingBoard />
      </div>
    </main>
  );
}
