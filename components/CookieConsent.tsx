
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
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

// Initialize GA4 only after analytics consent.
function initializeAnalytics(gaId: string): void {
  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  if (!window.gtag) {
    // Use the arguments object expected by the Google tag.
    window.gtag = function gtag(..._args: unknown[]): void {
      window.dataLayer?.push(arguments);
    };
  }

  // Avoid loading the Google tag more than once.
  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  // Default consent state.
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  // Analytics permission granted by the visitor.
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  window.gtag('js', new Date());

  // Page views are tracked manually for Next.js navigation.
  window.gtag('config', gaId, {
    send_page_view: false,
  });

  const script = document.createElement('script');

  script.id = SCRIPT_ID;
  script.async = true;

  script.src =
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;

  document.head.appendChild(script);
}

export default function CookieConsent({
  gaId,
}: CookieConsentProps) {
  const pathname = usePathname();

  const [choice, setChoice] = useState<Choice | null>(null);
  const [ready, setReady] = useState(false);
  const [showChoices, setShowChoices] = useState(false);

  const [footerTarget, setFooterTarget] =
    useState<HTMLElement | null>(null);

  const lastTrackedPage = useRef<string | null>(null);

  // Locate the existing website footer.
  useEffect(() => {
    const footer = document.querySelector<HTMLElement>(
      '.footer-bottom'
    );

    setFooterTarget(footer);
  }, []);

  // Restore previously saved cookie preference.
  useEffect(() => {
    let saved: string | null = null;

    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Continue if localStorage is unavailable.
    }

    const knownChoice: Choice | null =
      saved === 'accepted' || saved === 'rejected'
        ? saved
        : null;

    setChoice(knownChoice);
    setShowChoices(knownChoice === null);
    setReady(true);
  }, []);

  // Initialize analytics and track page navigation.
  useEffect(() => {
    if (!ready || choice !== 'accepted' || !gaId) {
      return;
    }

    initializeAnalytics(gaId);

    const currentPage = pathname || '/';

    if (lastTrackedPage.current === currentPage) {
      return;
    }

    lastTrackedPage.current = currentPage;

    window.gtag?.('event', 'page_view', {
      page_path: currentPage,
      page_location: window.location.href,
    });
  }, [choice, gaId, pathname, ready]);

  // Save visitor's analytics preference.
  function choose(nextChoice: Choice) {
    const wasAccepted = choice === 'accepted';

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        nextChoice
      );
    } catch {
      // Preserve the choice in React state.
    }

    setChoice(nextChoice);
    setShowChoices(false);

    // Reload to prevent further GA4 activity after rejection.
    if (nextChoice === 'rejected' && wasAccepted) {
      window.gtag?.('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });

      window.location.reload();
    }
  }

  if (!gaId || !ready) {
    return null;
  }

  return (
    <>
      {/* Cookie consent banner */}
      {showChoices && (
        <section
          className={styles.banner}
          aria-label="Analytics privacy choices"
        >
          <div className={styles.copy}>
            <strong>Privacy choices</strong>

            <p>
              We use optional Google Analytics to
              understand which calculators people visit.
              Essential website features work without
              analytics. You can change your choice
              anytime.{' '}
              <Link href="/privacy">
                Read our Privacy Policy
              </Link>.
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

      {/* Display privacy settings inside the footer */}
      {!showChoices &&
        footerTarget &&
        createPortal(
          <button
            type="button"
            className={styles.manage}
            onClick={() => setShowChoices(true)}
            aria-label="Change analytics privacy choices"
          >
            Privacy choices
          </button>,
          footerTarget
        )}
    </>
  );
}
