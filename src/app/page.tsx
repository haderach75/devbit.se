export const dynamic = "force-static";

export const metadata = {
  title: "Devbit Consulting",
  robots: { index: false, follow: false },
};

const redirectScript = `(function(){var t='en';try{var s=localStorage.getItem('locale');if(s==='sv'||s==='en')t=s;else if(navigator.language&&navigator.language.toLowerCase().indexOf('sv')===0)t='sv';}catch(e){}window.location.replace('/'+t+'/');})();`;

export default function RootRedirect() {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/en/" />
        </noscript>
        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      </head>
      <body />
    </html>
  );
}
