export const metadata = {
  robots: { index: false, follow: false },
};

const redirectScript = `(function(){var p=window.location.pathname;var seg=p.split('/')[1];if(seg==='en'||seg==='sv')return;var t='en';try{var s=localStorage.getItem('locale');if(s==='sv'||s==='en')t=s;else if(navigator.language&&navigator.language.toLowerCase().indexOf('sv')===0)t='sv';}catch(e){}var d='/'+t;if(p&&p!=='/')d='/'+t+p.replace(/\\/$/,'');window.location.replace(d);})();`;

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/en/" />
        </noscript>
        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      </head>
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>404 — Page not found</h1>
        <p style={{ marginTop: "1rem" }}>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/en/">Go to homepage</a>
        </p>
      </body>
    </html>
  );
}
