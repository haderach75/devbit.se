import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/services/service-card";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services — Devbit Consulting | Michael Hultman",
  description: "System architecture, senior C#/.NET development, cloud & DevOps, and technical consulting services.",
};

export default function ServicesPage() {
  return (
    <PageContainer>
      <SectionHeading label="Services" title="What Devbit Brings" description="System architecture, hands-on development, cloud infrastructure, and strategic consulting." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {services.map((service, i) => <ServiceCard key={service.id} service={service} index={i} />)}
      </div>
    </PageContainer>
  );
}
