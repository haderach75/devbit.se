import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    id: "architecture",
    title: { en: "System Architecture", sv: "Systemarkitektur" },
    description: {
      en: "Distributed systems design, DDD, CQRS, event sourcing. From monolith decomposition to greenfield design.",
      sv: "Design av distribuerade system, DDD, CQRS, event sourcing. Från monolitnedbrytning till greenfield-design.",
    },
    icon: "Cpu",
  },
  {
    id: "development",
    title: { en: "Senior Development", sv: "Senior utveckling" },
    description: {
      en: "Hands-on backend development in Go and C#/.NET. Clean code, test-driven, production-ready systems.",
      sv: "Hands-on backend-utveckling i Go och C#/.NET. Ren kod, test-driven och produktionsredo.",
    },
    icon: "Code",
  },
  {
    id: "ai",
    title: { en: "AI-Assisted Development", sv: "AI-assisterad utveckling" },
    description: {
      en: "Building AI into the development process itself — context engineering, prompt and session design, agent workflows, and getting consistent results from AI tools across a team.",
      sv: "Att bygga in AI i själva utvecklingsprocessen — context engineering, prompt- och sessionsdesign, agentflöden och att få konsekventa resultat från AI-verktyg i ett helt team.",
    },
    icon: "Sparkles",
  },
  {
    id: "cloud",
    title: { en: "Cloud & DevOps", sv: "Cloud & DevOps" },
    description: {
      en: "Azure, AWS, Kubernetes. Cloud migrations, infrastructure automation, CI/CD pipelines.",
      sv: "Azure, AWS, Kubernetes. Molnmigreringar, infrastrukturautomatisering och CI/CD-pipelines.",
    },
    icon: "Cloud",
  },
  {
    id: "consulting",
    title: { en: "Technical Consulting", sv: "Teknisk rådgivning" },
    description: {
      en: "Architecture reviews, tech strategy, team mentoring. Helping teams level up.",
      sv: "Arkitekturgranskningar, teknisk strategi, mentorskap. Hjälper team att växa.",
    },
    icon: "MessageSquare",
  },
];
