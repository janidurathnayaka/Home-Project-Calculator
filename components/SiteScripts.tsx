import Script from 'next/script';

// ==========================================
// GOOGLE ANALYTICS & ADSENSE CONFIGURATION
// ==========================================

export default function SiteScripts() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();

  const adsenseClient =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

  // Validate tracking identifiers
  const validGaId =
    gaId && /^G-[A-Z0-9]+$/i.test(gaId)
      ? gaId
      : null;

  const validAdsenseClient =
    adsenseClient &&
    /^ca-pub-\d+$/.test(adsenseClient)
      ? adsenseClient
      : null;

  return (
    <>
      {/* =====================================
          GOOGLE ANALYTICS
          Initialize tracking queue early.
          Load the external script lazily.
      ===================================== */}

      {validGaId && (
        <>
          <Script
            id="google-analytics-init"
            strategy="afterInteractive"
          >
            {`
              window.dataLayer = window.dataLayer || [];

              window.gtag = function() {
                window.dataLayer.push(arguments);
              };

              window.gtag('js', new Date());

              window.gtag(
                'config',
                ${JSON.stringify(validGaId)}
              );
            `}
          </Script>

          <Script
            id="google-analytics-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${validGaId}`}
            strategy="lazyOnload"
          />
        </>
      )}

      {/* =====================================
          GOOGLE ADSENSE
          Preserve early loading for ad slots.
      ===================================== */}

      {validAdsenseClient && (
        <Script
          id="google-adsense-loader"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${validAdsenseClient}`}
          strategy="afterInteractive"
          async
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}