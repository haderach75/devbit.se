import type { Metadata } from "next";
import { EventStormingBoard } from "@/components/eventstorming/board";

export const metadata: Metadata = {
  title: "Devbit Consulting | Michael Hultman — System Architect & Senior Developer",
  description:
    "System Architect and Senior Developer specializing in distributed systems, C#/.NET, cloud infrastructure, and clean architecture. Available for consulting.",
};

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <EventStormingBoard />
    </main>
  );
}
