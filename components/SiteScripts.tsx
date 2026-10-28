
import CookieConsent from '@/components/CookieConsent';

/**
 * Load Google Analytics only after
 * the visitor accepts analytics cookies.
 *
 * AdSense will be configured separately
 * after the required consent setup.
 */
export default function SiteScripts() {
  const configuredId =
    process.env.NEXT_PUBLIC_GA_ID?.trim() ?? '';

  const gaId = /^G-[A-Z0-9]+$/i.test(configuredId)
    ? configuredId
    : null;

  return <CookieConsent gaId={gaId} />;
}
