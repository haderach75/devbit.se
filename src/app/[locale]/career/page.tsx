import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventStream } from "@/components/career/event-stream";

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
