import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { inter, jetbrainsMono, dmSerifDisplay } from "@/lib/fonts";
import { Header } from "@/components/layout/header";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/i18n";
import "@/styles/globals.css";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return {
    metadataBase: new URL("https://devbit.se"),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://devbit.se/${locale}`,
      languages: { en: "/en", sv: "/sv" },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://devbit.se/${locale}`,
      siteName: "Devbit Consulting",
      locale: locale === "sv" ? "sv_SE" : "en_US",
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Devbit Consulting — Michael Hultman" }],
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description"), images: ["/og-image.png"] },
  };
}

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
