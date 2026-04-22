import type { SiteLink } from "@/lib/types";
import type { LocalizedString } from "@/lib/i18n";

export const siteLinks: SiteLink[] = [
  {
    label: { en: "Services", sv: "Tjänster" },
    href: "/services",
    description: { en: "Architecture, Development, Cloud", sv: "Arkitektur, utveckling, cloud" },
    icon: "Settings",
  },
  {
    label: { en: "Career", sv: "Karriär" },
    href: "/career",
    description: { en: "Event-sourced timeline", sv: "Event-sourced tidslinje" },
    icon: "ScrollText",
  },
  {
    label: { en: "Projects", sv: "Projekt" },
    href: "/projects",
    description: { en: "Case studies", sv: "Fallstudier" },
    icon: "Star",
  },
  {
    label: { en: "About", sv: "Om mig" },
    href: "/about",
    description: { en: "CV & personal", sv: "CV och personligt" },
    icon: "User",
  },
  {
    label: { en: "Contact", sv: "Kontakt" },
    href: "/contact",
    description: { en: "Get in touch", sv: "Hör av dig" },
    icon: "Mail",
  },
];

export const contactInfo = {
  email: "michael@devbit.se",
  phone: "+46 73-712 05 58",
  location: { en: "Vänersborg, Sweden", sv: "Vänersborg, Sverige" } as LocalizedString,
  availability: {
    en: "Available for contracts across Sweden and remote internationally.",
    sv: "Tillgänglig för uppdrag i Sverige och remote internationellt.",
  } as LocalizedString,
};
