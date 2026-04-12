import type { Metadata } from "next";
import { inter, jetbrainsMono, dmSerifDisplay } from "@/lib/fonts";
import { Header } from "@/components/layout/header";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://devbit.se"),
  title: "Devbit Consulting | Michael Hultman — System Architect & Senior Developer",
  description:
    "Freelance System Architect and Senior Developer specializing in distributed systems, C#/.NET, Go, DDD, CQRS, Event Sourcing, and cloud infrastructure (Azure, AWS, Kubernetes). Available for consulting in Sweden and remote internationally.",
  alternates: {
    canonical: "https://devbit.se",
  },
  openGraph: {
    title: "Devbit Consulting | Michael Hultman",
    description:
      "Freelance System Architect & Senior Developer. Distributed systems, C#/.NET, Go, cloud, DDD/CQRS. Available for consulting.",
    url: "https://devbit.se",
    siteName: "Devbit Consulting",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Devbit Consulting — Michael Hultman",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Devbit Consulting | Michael Hultman",
    description:
      "Freelance System Architect & Senior Developer. Distributed systems, C#/.NET, Go, cloud.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${dmSerifDisplay.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  name: "Michael Hultman",
                  jobTitle: "System Architect & Senior Developer",
                  url: "https://devbit.se",
                  email: "michael@devbit.se",
                  telephone: "+46737120558",
                  address: { "@type": "PostalAddress", addressLocality: "Vänersborg", addressCountry: "SE" },
                  worksFor: { "@type": "Organization", name: "Devbit Consulting AB" },
                },
                {
                  "@type": "Organization",
                  name: "Devbit Consulting AB",
                  url: "https://devbit.se",
                  logo: "https://devbit.se/logo.svg",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
