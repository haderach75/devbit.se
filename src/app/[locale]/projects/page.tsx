import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/data/projects";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.projects" });

  return (
    <PageContainer>
      <SectionHeading label={t("label")} title={t("title")} description={t("description")} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {projects.map((project, i) => <ProjectCard key={project.id} project={project} index={i} />)}
      </div>
    </PageContainer>
  );
}
