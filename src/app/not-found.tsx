import { LocaleRedirect } from "@/components/layout/locale-redirect";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/en/" />
        </noscript>
      </head>
      <body>
        <LocaleRedirect preservePath />
      </body>
    </html>
  );
}
