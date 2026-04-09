import type { Service } from "@/lib/types";

export const services: Service[] = [
  { id: "architecture", title: "System Architecture", description: "Distributed systems design, DDD, CQRS, event sourcing. From monolith decomposition to greenfield design.", icon: "Cpu" },
  { id: "development", title: "Senior Development", description: "Hands-on C#/.NET development. Clean code, test-driven, production-ready systems.", icon: "Code" },
  { id: "cloud", title: "Cloud & DevOps", description: "Azure, AWS, Kubernetes. Cloud migrations, infrastructure automation, CI/CD pipelines.", icon: "Cloud" },
  { id: "consulting", title: "Technical Consulting", description: "Architecture reviews, tech strategy, team mentoring. Helping teams level up.", icon: "MessageSquare" },
];
