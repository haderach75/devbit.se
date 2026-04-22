import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventStream } from "@/components/career/event-stream";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.career" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://devbit.se/${locale}/career`,
      languages: { en: "/en/career", sv: "/sv/career" },
    },
  };
}

export default async function CareerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.career" });

  return (
    <PageContainer>
      <SectionHeading label={t("label")} title={t("title")} description={t("description")} />
      <EventStream />
    </PageContainer>
  );
}
