import { setRequestLocale } from "next-intl/server";
import { CinematicPage } from "@/components/cinematic/cinematic-page";
import { careerEvents } from "@/data/career-events";
import { buildCvData, consultingRoleIds } from "@/data/cv-data";
import { experienceYears } from "@/lib/experience";
import type { Locale } from "@/lib/i18n";

// Stats derived from the career event stream — never typed in by hand.
function deriveStats() {
  const flat = careerEvents.flatMap((e) => [e, ...(e.children ?? [])]);
  const delivered = flat.filter((e) => e.type === "ProjectDelivered");
  // Clients = consulting assignments only; employers aren't clients.
  const assignments = careerEvents
    .filter((e) => consultingRoleIds.includes(e.id))
    .flatMap((e) => e.children ?? []);
  return {
    years: experienceYears(),
    projects: delivered.length,
    clients: new Set(assignments.map((e) => e.source)).size,
    founded: Number(careerEvents.find((e) => e.type === "CompanyFounded")?.timestamp ?? 2022),
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cv = buildCvData(locale as Locale);

  return <CinematicPage stats={deriveStats()} name={cv.name} linkedin={cv.linkedin} />;
}
