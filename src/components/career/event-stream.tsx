"use client";
import { careerEvents } from "@/data/career-events";
import { CareerEvent } from "./career-event";

export function EventStream() {
  return (
    <div className="rounded-xl border border-border bg-bg p-6 font-mono">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <div className="h-2 w-2 rounded-full bg-amber animate-pulse" />
        <span className="text-sm text-text-dim">Career.EventStore.replay() — {careerEvents.length} events</span>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-text-dim mb-4">{"// click a role to expand project details"}</p>
        {careerEvents.map((event) => <CareerEvent key={event.id} event={event} />)}
      </div>
    </div>
  );
}
