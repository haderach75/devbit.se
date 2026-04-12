import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SkillTags } from "@/components/about/skill-tags";
import { ExperienceItem } from "@/components/about/experience-item";
import { DownloadCvButton } from "@/components/cv/download-cv-button";
import { languages } from "@/data/languages";

export const metadata: Metadata = {
  title: "About — Devbit Consulting | Michael Hultman",
  description:
    "Michael Hultman — Freelance System Architect and Senior Developer. 20+ years experience in distributed systems, C#/.NET, Go, and cloud infrastructure. Based in Vänersborg, Sweden.",
  alternates: { canonical: "https://devbit.se/about" },
};

export default function AboutPage() {
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
          <SectionHeading label="About" title="Michael Hultman" description="System Architect & Senior Developer" />
          <div className="text-sm md:text-base text-text-muted max-w-2xl space-y-3">
            <p>
              With over 20 years in the software industry, I specialize in distributed systems, cloud infrastructure, and clean architecture. My expertise lies in the .NET platform, especially C#, with deep experience in DDD, CQRS, and Event Sourcing.
            </p>
            <p>
              I keep up with the latest trends in the industry and have spent the past two and a half years working hands-on with AI-assisted development, focusing on context engineering, structuring sessions and prompts to get the most out of AI tools.
            </p>
            <p>
              I run Devbit Consulting AB from Vänersborg, Sweden.
            </p>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-amber mb-3">Expertise</p>
        <SkillTags />
      </div>
      <div className="flex flex-wrap gap-3 mb-0">
        <Link href="/career" className="mb-8 inline-block rounded-lg border border-crimson/30 bg-crimson/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-crimson hover:bg-crimson/20 transition-colors">
          View interactive Career Event Stream →
        </Link>
        <DownloadCvButton />
        <DownloadCvButton variant="broker" />
      </div>
      <div className="mb-8">
        <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">Experience</p>
        <ExperienceItem title="Freelance System Architect / Developer" company="Devbit Consulting AB" dates="Aug 2022 — Present" description="Freelance consulting. Clients: Worldstream (datacenter deployer), Volvo Energy (IoT cloud backend), Stena Line (booking system modernization)." />
        <ExperienceItem title="Consultant Architect / Developer" company="Evolve / Afry" dates="Mar 2021 — Aug 2022" description="Consulting assignments: Worldstream (Go/DDD/CQRS systems), Cuviva (Azure to Kubernetes migration for medtech)." />
        <ExperienceItem title="Architect" company="Collector Bank" dates="Feb 2017 — Mar 2021" description="Credit evaluation, anti-fraud, GDPR compliance, and AML on Azure/Kubernetes." />
        <ExperienceItem title="Software Developer" company="Autocom Diagnostic Partner" dates="Aug 2007 — Feb 2017" description="Vehicle diagnostic tools, licensing systems, and distributed device testing." />
      </div>
      <div className="mb-8">
        <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">Education</p>
        <ExperienceItem title="Computer Science / Information Systems" company="University West" dates="2001 — 2005" description="" />
        <ExperienceItem title="Business Economics" company="Högskolan Trollhättan/Uddevalla" dates="1996 — 1998" description="" />
      </div>
      <div>
        <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">Languages</p>
        <div className="flex flex-wrap gap-3 md:gap-4 text-sm md:text-base text-text-muted">
          {languages.map((lang) => (
            <span key={lang.name}>{lang.name} <span className="text-text-dim">({lang.level})</span></span>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
