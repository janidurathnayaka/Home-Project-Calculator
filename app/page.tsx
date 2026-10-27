import type { Metadata } from 'next';
import Link from 'next/link';

import {
  ArrowRight,
  CheckCircle2,
  Ruler,
  ShieldCheck,
  Wrench,
  Bookmark,
  Calculator,
} from 'lucide-react';

import CalculatorCard from '@/components/CalculatorCard';
import GuideCard from '@/components/GuideCard';
import Newsletter from '@/components/Newsletter';
import AdSlot from '@/components/AdSlot';

import { calculators } from '@/lib/calculators';
import { guides } from '@/lib/guides';
import { brand } from '@/lib/brand';

// ============================================
// HOMEPAGE SEO CONFIGURATION
// ============================================

const siteUrl = brand.siteUrl.replace(/\/$/, '');

const homeTitle =
  `Free Home Improvement Calculators & Cost Estimators | ${brand.name}`;

const homeDescription =
  'Use free home improvement calculators for painting, ' +
  'flooring, tile, roofing, concrete and renovations. ' +
  'Estimate material quantities and project costs.';

// ============================================
// HOMEPAGE METADATA
// ============================================

export const metadata: Metadata = {
  title: {
    absolute: homeTitle,
  },

  description: homeDescription,

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: brand.name,
    title: homeTitle,
    description: homeDescription,
    url: siteUrl + '/',
  },

  twitter: {
    card: 'summary',
    title: homeTitle,
    description: homeDescription,
  },

  robots: {
    index: true,
    follow: true,
  },
};

// ============================================
// HOMEPAGE COMPONENT
// ============================================

export default function HomePage() {

  const featuredCalculators = calculators.slice(0, 6);

  // ==========================================
  // STRUCTURED DATA
  // ==========================================

  const homepageStructuredData = {
    '@context': 'https://schema.org',

    '@type': 'WebPage',

    name: homeTitle,

    description: homeDescription,

    url: siteUrl + '/',

    inLanguage: 'en',

    isPartOf: {
      '@type': 'WebSite',
      name: brand.name,
      url: siteUrl + '/',
    },

    mainEntity: {
      '@type': 'ItemList',

      name: 'Featured Home Improvement Calculators',

      itemListElement: featuredCalculators.map(
        (calculator, index) => ({
          '@type': 'ListItem',

          position: index + 1,

          name: calculator.title,

          url:
            siteUrl +
            '/calculators/' +
            calculator.slug,
        })
      ),
    },
  };

  const safeStructuredData = JSON.stringify(
    homepageStructuredData
  ).replace(/</g, '\\u003c');

  return (
    <>
      {/* ====================================
          HOMEPAGE STRUCTURED DATA
      ==================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeStructuredData,
        }}
      />

      {/* ====================================
          HERO SECTION
      ==================================== */}

      <section className="hero">

        <div
          className="hero-grid-bg"
          aria-hidden="true"
        />

        <div className="container hero-inner">

          <div className="hero-copy">

            <span className="hero-badge">
              <Wrench size={15} aria-hidden="true" />
              Free homeowner planning toolkit
            </span>

            <h1>
              Measure smarter.
              <br />
              <span>Build with confidence.</span>
            </h1>

            <p>
              Fast, transparent home-improvement
              calculators that turn dimensions and
              local prices into practical shopping
              quantities and planning budgets.
            </p>

            <div className="hero-actions">

              <Link
                href="/calculators"
                className="primary-btn"
              >
                Explore calculators
                <ArrowRight size={18} aria-hidden="true" />
              </Link>

              <Link
                href="/guides"
                className="secondary-btn"
              >
                Read cost guides
              </Link>

            </div>

            <div className="hero-trust">

              <span>
                <CheckCircle2 size={16} aria-hidden="true" />
                No signup required
              </span>

              <span>
                <CheckCircle2 size={16} aria-hidden="true" />
                Editable local prices
              </span>

              <span>
                <CheckCircle2 size={16} aria-hidden="true" />
                Save & print estimates
              </span>

            </div>

          </div>

          {/* HERO CALCULATOR PREVIEW */}

          <div className="hero-panel">

            <div className="mini-window">

              <div className="window-bar">
                <i />
                <i />
                <i />
                <span>Paint Calculator</span>
              </div>

              <div className="window-content">

                <div className="mini-label">
                  EXAMPLE ROOM
                </div>

                <div className="mini-inputs">

                  <span>14 ft</span>
                  <b>×</b>

                  <span>12 ft</span>
                  <b>×</b>

                  <span>8 ft high</span>

                </div>

                <div className="mini-divider" />

                <div className="mini-result">

                  <small>
                    EXAMPLE RECOMMENDED PURCHASE
                  </small>

                  <strong>3 gallons</strong>

                  <p>
                    Example material cost
                    <b> $135</b>
                  </p>

                </div>

                <div
                  className="mini-bars"
                  aria-hidden="true"
                >
                  <span style={{ width: '86%' }} />
                  <span style={{ width: '62%' }} />
                  <span style={{ width: '74%' }} />
                </div>

              </div>

            </div>

            <div className="float-card one">

              <Ruler size={19} aria-hidden="true" />

              <div>
                <small>Material planning</small>
                <strong>Waste included</strong>
              </div>

            </div>

            <div className="float-card two">

              <Bookmark size={19} aria-hidden="true" />

              <div>
                <small>Saved locally</small>
                <strong>Your estimates</strong>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================
          TRUST AND PROOF STRIP
      ==================================== */}

      <section
        className="proof-strip"
        aria-label="Website features"
      >

        <div className="container proof-grid">

          <div>
            <Calculator aria-hidden="true" />
            <span>
              <strong>{calculators.length}</strong>
              {' '}practical calculators
            </span>
          </div>

          <div>
            <Wrench aria-hidden="true" />
            <span>
              <strong>Editable</strong>
              {' '}supplier prices
            </span>
          </div>

          <div>
            <ShieldCheck aria-hidden="true" />
            <span>
              <strong>Transparent</strong>
              {' '}assumptions
            </span>
          </div>

          <div>
            <Ruler aria-hidden="true" />
            <span>
              <strong>US + metric</strong>
              {' '}input tools
            </span>
          </div>

        </div>

      </section>

      {/* ====================================
          FEATURED CALCULATORS
      ==================================== */}

      <section className="section home-project-section">

        <div className="container">

          <div className="project-section-head">

            <div>

              <span className="eyebrow">
                POPULAR PROJECT TOOLS
              </span>

              <h2>
                Start with the job in front of you.
              </h2>

              <p>
                Choose a project, enter your measurements,
                then adjust local prices to build a
                realistic shopping plan.
              </p>

            </div>

            <div className="project-section-side">

              <span className="project-count">
                <strong>{calculators.length}</strong>
                {' '}calculators
              </span>

              <Link
                href="/calculators"
                className="text-link"
              >
                Browse the full toolkit
                <ArrowRight size={16} aria-hidden="true" />
              </Link>

            </div>

          </div>

          <div className="home-tools-grid">

            {featuredCalculators.map(
              (calculator, index) => (
                <CalculatorCard
                  key={calculator.slug}
                  calculator={calculator}
                  index={index}
                  featured={index === 0}
                />
              )
            )}

          </div>

        </div>

      </section>

      {/* ====================================
          ADVERTISEMENT AREA
      ==================================== */}

      <div className="container">
        <AdSlot />
      </div>

      {/* ====================================
          WHY USE OUR CALCULATORS
      ==================================== */}

      <section className="feature-band">

        <div className="container feature-band-grid">

          <div className="feature-big">

            <span className="eyebrow light">
              BUILT FOR REAL PROJECTS
            </span>

            <h2>
              A calculator should explain the
              number, not just show it.
            </h2>

            <p>
              Every tool exposes the assumptions
              behind the estimate, lets you replace
              default prices with local quotes,
              and gives you a purchase quantity
              rounded the way stores actually
              sell materials.
            </p>

            <Link
              href="/calculators"
              className="inverted-btn"
            >
              Try a calculator
              <ArrowRight size={17} aria-hidden="true" />
            </Link>

          </div>

          <div className="feature-stack">

            <div>
              <span>01</span>
              <h3>Use your local price</h3>
              <p>
                Replace sample prices with a
                supplier or contractor quote.
              </p>
            </div>

            <div>
              <span>02</span>
              <h3>Plan for waste</h3>
              <p>
                Adjust waste factors for cuts,
                patterns, breakage, and site conditions.
              </p>
            </div>

            <div>
              <span>03</span>
              <h3>Keep the result</h3>
              <p>
                Save project snapshots on your
                device, copy them, or print them.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ====================================
          PRACTICAL HOME IMPROVEMENT GUIDES
      ==================================== */}

      <section className="section container">

        <div className="section-heading">

          <div>

            <span className="eyebrow">
              LEARN BEFORE YOU BUY
            </span>

            <h2>
              Short practical guides
            </h2>

            <p>
              No filler — just the assumptions
              that change quantities and budgets.
            </p>

          </div>

          <Link
            href="/guides"
            className="text-link"
          >
            All guides
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

        </div>

        <div className="guide-grid">

          {guides.slice(0, 3).map((guide) => (
            <GuideCard
              key={guide.slug}
              guide={guide}
            />
          ))}

        </div>

      </section>

      {/* ====================================
          NEWSLETTER / GUIDES SECTION
      ==================================== */}

      <section className="container section-sm">
        <Newsletter />
      </section>

    </>
  );
}