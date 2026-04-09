import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventStream } from "@/components/career/event-stream";

export const metadata: Metadata = {
  title: "Career Stream — Devbit Consulting | Michael Hultman",
  description: "20+ years of software engineering experience as an event-sourced timeline. System architecture, distributed systems, cloud development.",
};

export default function CareerPage() {
  return (
    <PageContainer>
      <SectionHeading label="Career Stream" title="Career.EventStore.replay()" description="20+ years of software engineering, replayed as an event stream. Click roles to expand project details." />
      <EventStream />
    </PageContainer>
  );
}
