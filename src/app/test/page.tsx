import type { Metadata } from "next";
import { EventStormingBoard } from "@/components/eventstorming/board";

export const metadata: Metadata = {
  title: "Test — Event Storming Homepage",
};

export default function TestPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <EventStormingBoard />
    </main>
  );
}
