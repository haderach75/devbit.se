import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SkillTags } from "@/components/about/skill-tags";
import { ExperienceItem } from "@/components/about/experience-item";

export const metadata: Metadata = {
  title: "About — Devbit Consulting | Michael Hultman",
  description: "Michael Hultman — System Architect and Senior Developer with 20+ years of experience in distributed systems, C#/.NET, and cloud infrastructure.",
};

export default function AboutPage() {
  return (
    <PageContainer>
      <SectionHeading label="About" title="Michael Hultman" description="System Architect & Senior Developer" />
      <p className="text-text-muted mb-6 max-w-2xl">
        With over 20 years in the software industry, I specialize in distributed systems, cloud infrastructure, and clean architecture. My expertise lies in the .NET platform, especially C#, with deep experience in DDD, CQRS, and Event Sourcing. I run Devbit Consulting AB from Vänersborg, Sweden.
      </p>
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-amber mb-3">Expertise</p>
        <SkillTags />
      </div>
      <Link href="/career" className="mb-8 inline-block rounded-lg border border-crimson/30 bg-crimson/10 px-4 py-2 text-sm text-crimson hover:bg-crimson/20 transition-colors">
        View interactive Career Event Stream →
      </Link>
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">Experience</p>
        <ExperienceItem title="Architect / Developer" company="Volvo Energy — Freelancer via Devbit" dates="Dec 2023 — Present" description="IoT energy cloud backend with MQTT, OCPP, Orleans, AWS, gRPC, GraphQL." />
        <ExperienceItem title="Architect / Developer" company="Stena Line — Consultant via Devbit" dates="Jan 2023 — Dec 2023" description="Monolith to distributed booking system transformation." />
        <ExperienceItem title="Architect / Developer" company="Worldstream — Consultant via Devbit" dates="Sep 2021 — Jan 2023" description="Go-based DDD/CQRS/ES systems for VXLAN automation." />
        <ExperienceItem title="Developer / DevOps" company="Cuviva — Consultant" dates="Mar 2021 — Sep 2021" description="Azure to hybrid cloud migration in Kubernetes for medtech." />
        <ExperienceItem title="Architect" company="Collector Bank" dates="Feb 2017 — Mar 2021" description="Credit evaluation, anti-fraud, GDPR compliance, and AML on Azure/Kubernetes." />
        <ExperienceItem title="Software Developer" company="Autocom Diagnostic Partner" dates="Aug 2007 — Feb 2017" description="Vehicle diagnostic tools, licensing systems, and distributed device testing." />
      </div>
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">Education</p>
        <ExperienceItem title="Computer Science / System Development" company="University West" dates="2001 — 2005" description="" />
        <ExperienceItem title="Business Economics" company="Högskolan Trollhättan/Uddevalla" dates="1996 — 1998" description="" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-amber mb-3 border-b border-border pb-2">Languages</p>
        <div className="flex gap-4 text-sm text-text-muted">
          <span>Swedish <span className="text-text-dim">(native)</span></span>
          <span>English <span className="text-text-dim">(fluent)</span></span>
          <span>German <span className="text-text-dim">(basic)</span></span>
        </div>
      </div>
    </PageContainer>
  );
}
