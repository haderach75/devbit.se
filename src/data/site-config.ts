import type { SiteLink } from "@/lib/types";

export const siteLinks: SiteLink[] = [
  { label: "Services", href: "/services", description: "Architecture, Development, Cloud", icon: "Settings" },
  { label: "Career", href: "/career", description: "Event-sourced timeline", icon: "ScrollText" },
  { label: "Projects", href: "/projects", description: "Case studies", icon: "Star" },
  { label: "About", href: "/about", description: "CV & personal", icon: "User" },
  { label: "Contact", href: "/contact", description: "Get in touch", icon: "Mail" },
];

export const contactInfo = {
  email: "michael@devbit.se",
  phone: "+46 73-712 05 58",
  location: "Vänersborg, Sweden",
  availability: "Available for contracts across Sweden and remote internationally.",
};
