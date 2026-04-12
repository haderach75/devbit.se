import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

export const metadata: Metadata = {
  title: "Contact — Devbit Consulting | Michael Hultman",
  description:
    "Hire a freelance system architect and senior developer. Contact Michael Hultman at Devbit Consulting for consulting in distributed systems, C#, Go, and cloud.",
  alternates: { canonical: "https://devbit.se/contact" },
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
