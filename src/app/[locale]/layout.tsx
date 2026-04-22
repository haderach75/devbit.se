import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { inter, jetbrainsMono, dmSerifDisplay } from "@/lib/fonts";
import { Header } from "@/components/layout/header";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/i18n";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://devbit.se"),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const typedLocale = locale as Locale;

  return (
    <html lang={typedLocale} className={`${inter.variable} ${jetbrainsMono.variable} ${dmSerifDisplay.variable}`}>
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
                  jobTitle: typedLocale === "sv" ? "Systemarkitekt & Senior Utvecklare" : "System Architect & Senior Developer",
                  url: `https://devbit.se/${typedLocale}`,
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
        <NextIntlClientProvider locale={typedLocale} messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
