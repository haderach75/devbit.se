import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventStream } from "@/components/career/event-stream";

export const metadata: Metadata = {
  title: "Career Stream — Devbit Consulting | Michael Hultman",
  description:
    "Career timeline of Michael Hultman — 20+ years in software development, from automotive diagnostics to fintech and cloud infrastructure consulting.",
  alternates: { canonical: "https://devbit.se/career" },
};

export default async function CareerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PageContainer>
      <SectionHeading label="Career Stream" title="Career.EventStore.replay()" description="20+ years of software engineering, replayed as an event stream. Click roles to expand project details." />
      <EventStream />
    </PageContainer>
  );
}
