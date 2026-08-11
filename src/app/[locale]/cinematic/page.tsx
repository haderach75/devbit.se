import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CinematicPage } from "@/components/cinematic/cinematic-page";
import { careerEvents } from "@/data/career-events";
import { buildCvData } from "@/data/cv-data";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.cinematic" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://devbit.se/${locale}/cinematic`,
      languages: { en: "/en/cinematic", sv: "/sv/cinematic" },
    },
  };
}

// Stats derived from the career event stream — never typed in by hand.
function deriveStats() {
  const flat = careerEvents.flatMap((e) => [e, ...(e.children ?? [])]);
  const delivered = flat.filter((e) => e.type === "ProjectDelivered");
  const firstRoleYear = Math.min(
    ...careerEvents.filter((e) => e.type === "RoleStarted").map((e) => Number(e.timestamp.slice(0, 4)))
  );
  return {
    years: new Date().getFullYear() - firstRoleYear,
    systems: delivered.length,
    clients: new Set(delivered.map((e) => e.source)).size,
    founded: Number(careerEvents.find((e) => e.type === "CompanyFounded")?.timestamp ?? 2022),
  };
}

export default async function Cinematic({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cv = buildCvData(locale as Locale);

  return <CinematicPage stats={deriveStats()} name={cv.name} linkedin={cv.linkedin} />;
}
