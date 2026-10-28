import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how Home Project Calculator handles saved estimates, website analytics, contact submissions, and optional advertising.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="legal-page container">
      <h1>Privacy Policy</h1>
      <p>Last updated: October 28, 2026</p>

      <p>
        Home Project Calculator provides home-improvement planning tools without
        requiring visitors to create an account. This notice describes the
        main types of information that may be handled when you use the site.
      </p>

      <h2>Saved estimates and local storage</h2>
      <p>
        When you save a project estimate, it is stored locally in your browser
        using local storage. Saved estimates are not automatically synced to
        an online account. Other people who use the same browser profile may
        be able to see information you save there.
      </p>
      <p>
        You can delete saved estimates from the Saved Estimates page, or
        clear website data through your browser settings.
      </p>

      <h2>Google Analytics</h2>
      <p>
        The website uses Google Analytics 4 to understand general usage, such
        as page views, interactions, approximate geographic regions and device
        characteristics. Google Analytics may use cookies and similar
        technologies, and Google may process data in accordance with its own
        privacy practices. We use these reports to improve site content and
        usability rather than to provide user accounts.
      </p>
      <p>
        To learn more, visit{' '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google&apos;s Privacy Policy
        </a>
        . Browser settings, tracking protection and extensions may limit
        analytics cookies and requests.
      </p>

      <h2>Contact form submissions</h2>
      <p>
        If you send a message through our contact form, we may process the
        information you submit, including any name, email address and message,
        in order to respond. A third-party email delivery provider may
        process that information when contact email delivery is enabled.
        Please avoid submitting sensitive personal information.
      </p>

      <h2>Hosting and technical information</h2>
      <p>
        This site is hosted using Netlify. Like other hosting services,
        the provider may process technical request information, such as IP
        addresses, to deliver pages and maintain security and reliability.
        See the provider&apos;s published privacy information for details.
      </p>

      <h2>Advertising and affiliate links</h2>
      <p>
        The site may enable advertising and affiliate links in the future.
        Advertising partners may use cookies or similar identifiers if their
        services are activated. Any active advertising and associated choices
        must be disclosed in accordance with applicable requirements. See our{' '}
        <Link href="/affiliate-disclosure">Affiliate Disclosure</Link> for
        more information about potential affiliate relationships.
      </p>

      <h2>Your choices</h2>
      <p>
        You can remove locally saved estimates, change browser cookie settings,
        and use browser tracking-protection features. Where consent is
        required for analytics or advertising technologies, additional
        consent controls may be necessary; this policy is an explanation,
        not a substitute for those controls.
      </p>

      <h2>Questions and policy updates</h2>
      <p>
        If you have a privacy question, please use our{' '}
        <Link href="/contact">Contact page</Link>. We may update this policy
        when the website, its integrations or applicable requirements change.
      </p>
    </main>
  );
}
