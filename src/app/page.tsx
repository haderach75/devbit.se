import { LocaleRedirect } from "@/components/layout/locale-redirect";

export const dynamic = "force-static";

export const metadata = {
  title: "Devbit Consulting",
  robots: { index: false, follow: false },
};

export default function RootRedirect() {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/en/" />
        </noscript>
      </head>
      <body>
        <LocaleRedirect />
      </body>
    </html>
  );
}
