import { setRequestLocale } from "next-intl/server";
import { CinematicPage } from "@/components/cinematic/cinematic-page";
import { careerEvents } from "@/data/career-events";
import { buildCvData } from "@/data/cv-data";
import { experienceYears } from "@/lib/experience";
import type { Locale } from "@/lib/i18n";

// Stats derived from the career event stream — never typed in by hand.
function deriveStats() {
  const flat = careerEvents.flatMap((e) => [e, ...(e.children ?? [])]);
  const delivered = flat.filter((e) => e.type === "ProjectDelivered");
  return {
    years: experienceYears(),
    systems: delivered.length,
    clients: new Set(delivered.map((e) => e.source)).size,
    founded: Number(careerEvents.find((e) => e.type === "CompanyFounded")?.timestamp ?? 2022),
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cv = buildCvData(locale as Locale);

  return <CinematicPage stats={deriveStats()} name={cv.name} linkedin={cv.linkedin} />;
}
