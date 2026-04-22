import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects — Devbit Consulting | Michael Hultman",
  description:
    "Consulting case studies: Volvo Energy IoT cloud, Stena Line booking modernization, Worldstream datacenter automation, Collector Bank fintech platform.",
  alternates: { canonical: "https://devbit.se/projects" },
};

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PageContainer>
      <SectionHeading label="Projects" title="Case Studies" description="Featured projects across EV charging, banking, shipping, and datacenter infrastructure." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {projects.map((project, i) => <ProjectCard key={project.id} project={project} index={i} />)}
      </div>
    </PageContainer>
  );
}
