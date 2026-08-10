import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://devbit.se"),
  title: "Devbit Consulting | Michael Hultman — System Architect & Senior Developer",
  description:
    "Freelance System Architect and Senior Developer specializing in distributed systems, Go, C#/.NET, DDD, CQRS, Event Sourcing, AI-assisted development, and cloud infrastructure (Azure, AWS, Kubernetes). Available for consulting in Sweden and remote internationally.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
