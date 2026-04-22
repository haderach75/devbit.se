import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { EventStormingBoard } from "@/components/eventstorming/board";
import { MobileEventStormingBoard } from "@/components/eventstorming/mobile-board";

export const metadata: Metadata = {
  title: "Devbit Consulting | Michael Hultman — System Architect & Senior Developer",
  description:
    "System Architect and Senior Developer specializing in distributed systems, C#/.NET, cloud infrastructure, and clean architecture. Available for consulting.",
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
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
