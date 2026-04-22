import { setRequestLocale } from "next-intl/server";
import { EventStormingBoard } from "@/components/eventstorming/board";
import { MobileEventStormingBoard } from "@/components/eventstorming/mobile-board";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
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
