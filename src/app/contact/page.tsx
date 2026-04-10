import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

export const metadata: Metadata = {
  title: "Contact — Devbit Consulting | Michael Hultman",
  description: "Get in touch with Michael Hultman at Devbit Consulting. Available for system architecture and senior development contracts.",
};

export default function ContactPage() {
  return (
    <PageContainer>
      <SectionHeading label="Contact" title="Get In Touch" description="Have a project in mind? Let's talk." />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ContactForm />
        <ContactInfo />
      </div>
    </PageContainer>
  );
}
