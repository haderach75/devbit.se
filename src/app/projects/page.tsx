import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects — Devbit Consulting | Michael Hultman",
  description: "Featured case studies: IoT cloud platforms, banking modernization, booking systems, and network automation.",
};

export default function ProjectsPage() {
  return (
    <PageContainer>
      <SectionHeading label="Projects" title="Case Studies" description="Featured projects across EV charging, banking, shipping, and datacenter infrastructure." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {projects.map((project, i) => <ProjectCard key={project.id} project={project} index={i} />)}
      </div>
    </PageContainer>
  );
}
