import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.contact" });

  return (
    <PageContainer>
      <SectionHeading label={t("label")} title={t("title")} description={t("description")} />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ContactForm />
        <ContactInfo />
      </div>
    </PageContainer>
  );
}
