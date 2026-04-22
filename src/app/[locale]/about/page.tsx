import Image from "next/image";
import Link from "next/link";
import { setRequestLocale, getTranslations, getMessages } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SkillTags } from "@/components/about/skill-tags";
import { ExperienceItem } from "@/components/about/experience-item";
import { DownloadCvButton } from "@/components/cv/download-cv-button";
import { languages } from "@/data/languages";
import { loc, localizedHref, type Locale } from "@/lib/i18n";

interface ExperienceEntry {
  title: string;
  company: string;
  dates: string;
  description?: string;
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: "about" });
  const tPage = await getTranslations({ locale, namespace: "pages.about" });

  // Paragraphs are a string array under the `about` namespace.
  const paragraphs = t.raw("paragraphs") as string[];

  // Experience/education are top-level string-object arrays in the message bundle.
  // `getTranslations({ namespace: "experience" }).raw("")` isn't reliable across next-intl versions
  // because `""` isn't a valid key path. Read from the full messages bundle instead.
  const messages = (await getMessages()) as {
    experience?: ExperienceEntry[];
    education?: ExperienceEntry[];
  };
  const experience: ExperienceEntry[] = messages.experience ?? [];
  const education: ExperienceEntry[] = messages.education ?? [];

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <Image
          src="/michael.jpg"
          alt="Michael Hultman"
          width={160}
          height={160}
          className="rounded-xl border border-border object-cover w-28 h-28 md:w-40 md:h-40 shrink-0"
        />
        <div>
          <SectionHeading label={tPage("label")} title={tPage("title")} description={tPage("description")} />
          <div className="text-sm md:text-base text-text-muted max-w-2xl space-y-3">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </div>
      <div className="mb-8">
        <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-amber mb-3">{t("expertise")}</p>
        <SkillTags />
      </div>
      <div className="flex flex-wrap gap-3 mb-0">
        <Link href={localizedHref("/career", typedLocale)} className="mb-8 inline-block rounded-lg border border-crimson/30 bg-crimson/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-crimson hover:bg-crimson/20 transition-colors">
          {t("viewCareerStream")}
        </Link>
        <DownloadCvButton />
        <DownloadCvButton variant="broker" />
      </div>
      <div className="mb-8">
        <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">{t("experienceHeading")}</p>
        {experience.map((e, i) => (
          <ExperienceItem key={i} title={e.title} company={e.company} dates={e.dates} description={e.description ?? ""} />
        ))}
      </div>
      <div className="mb-8">
        <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">{t("educationHeading")}</p>
        {education.map((e, i) => (
          <ExperienceItem key={i} title={e.title} company={e.company} dates={e.dates} description={e.description ?? ""} />
        ))}
      </div>
      <div>
        <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">{t("languagesHeading")}</p>
        <div className="flex flex-wrap gap-3 md:gap-4 text-sm md:text-base text-text-muted">
          {languages.map((lang) => (
            <span key={lang.name.en}>{loc(lang.name, typedLocale)} <span className="text-text-dim">({loc(lang.level, typedLocale)})</span></span>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
