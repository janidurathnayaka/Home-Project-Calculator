'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styles from './CookieConsent.module.css';

type Choice = 'accepted' | 'rejected';

type CookieConsentProps = {
  gaId: string | null;
};

const STORAGE_KEY = 'hpc-analytics-consent-v1';
const SCRIPT_ID = 'hpc-ga4-script';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Basic consent: GA4 does not load or send analytics events before opt-in. */
function initializeAnalytics(gaId: string): void {
  if (!window.dataLayer) window.dataLayer = [];
  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }

  if (document.getElementById(SCRIPT_ID)) return;

  // Establish consent mode state before loading the Google tag.
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  window.gtag('config', gaId, { send_page_view: false });

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  document.head.appendChild(script);
}

export default function CookieConsent({ gaId }: CookieConsentProps) {
  const pathname = usePathname();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [ready, setReady] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const lastTrackedPage = useRef<string | null>(null);

  // Read the saved preference only in the browser, avoiding hydration mismatch.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage may be blocked; the visitor can still make a session choice.
    }
    const knownChoice = saved === 'accepted' || saved === 'rejected' ? saved : null;
    setChoice(knownChoice);
    setShowChoices(knownChoice === null);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || choice !== 'accepted' || !gaId) return;

    initializeAnalytics(gaId);
    const currentPage = pathname || '/';
    if (lastTrackedPage.current === currentPage) return;

    lastTrackedPage.current = currentPage;
    window.gtag?.('event', 'page_view', {
      page_path: currentPage,
      page_location: window.location.href,
    });
  }, [choice, gaId, pathname, ready]);

  function choose(nextChoice: Choice) {
    const wasAccepted = choice === 'accepted';
    try {
      window.localStorage.setItem(STORAGE_KEY, nextChoice);
    } catch {
      // The in-memory choice remains usable even when storage is disabled.
    }

    setChoice(nextChoice);
    setShowChoices(false);

    if (nextChoice === 'rejected' && wasAccepted) {
      // Unload GA4 entirely so no subsequent analytics requests can occur.
      window.gtag?.('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
      window.location.reload();
    }
  }

  if (!gaId || !ready) return null;

  return (
    <>
      {showChoices && (
        <section className={styles.banner} aria-label="Analytics privacy choices">
          <div className={styles.copy}>
            <strong>Privacy choices</strong>
            <p>
              We use optional Google Analytics to understand which calculators
              people visit. Essential website features work without analytics.
              You can change your choice anytime.{' '}
              <Link href="/privacy">Read our Privacy Policy</Link>.
            </p>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.reject}
              type="button"
              onClick={() => choose('rejected')}
            >
              Reject analytics
            </button>
            <button
              className={styles.accept}
              type="button"
              onClick={() => choose('accepted')}
            >
              Accept analytics
            </button>
          </div>
        </section>
      )}

      {!showChoices && (
        <button
          type="button"
          className={styles.manage}
          onClick={() => setShowChoices(true)}
          aria-label="Change analytics privacy choices"
        >
          Privacy choices
        </button>
      )}
    </>
  );
}
