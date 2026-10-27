import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import CalculatorClient from "@/components/CalculatorClient";
import AdSlot from "@/components/AdSlot";

import {
  calculatorBySlug,
  calculators,
} from "@/lib/calculators";

import { guides } from "@/lib/guides";
import { brand } from "@/lib/brand";

// ============================================
// SEO CONFIGURATION
// ============================================

const siteUrl = brand.siteUrl.replace(/\/$/, "");

type CalculatorPageProps = {
  params: Promise<{ slug: string }>;
};

// Secure JSON-LD serialization
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// Build absolute URLs consistently
function calculatorUrl(slug: string): string {
  return `${siteUrl}/calculators/${encodeURIComponent(slug)}`;
}

// ============================================
// GENERATE STATIC CALCULATOR PAGES
// ============================================

export function generateStaticParams() {
  return calculators.map((calculator) => ({
    slug: calculator.slug,
  }));
}

// ============================================
// DYNAMIC SEO METADATA
// ============================================

export async function generateMetadata({
  params,
}: CalculatorPageProps): Promise<Metadata> {
  const { slug } = await params;

  const calculator = calculatorBySlug(slug);

  if (!calculator) {
    return {
      title: "Calculator Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    `${calculator.title} – Free Project Estimator`;

  const description = calculator.description;

  const url = calculatorUrl(calculator.slug);

  return {
    // Unique SEO title for each calculator
    title,

    // Unique calculator description
    description,

    // Canonical URL
    alternates: {
      canonical: url,
    },

    // Social media sharing
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: brand.name,
      title: `${title} | ${brand.name}`,
      description,
      url,
    },

    // Twitter / X sharing
    twitter: {
      card: "summary",
      title: `${title} | ${brand.name}`,
      description,
    },

    // Search engine instructions
    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

// ============================================
// CALCULATOR PAGE COMPONENT
// ============================================

export default async function CalculatorPage({
  params,
}: CalculatorPageProps) {
  const { slug } = await params;

  const c = calculatorBySlug(slug);

  if (!c) {
    notFound();
  }

  const currentUrl = calculatorUrl(c.slug);

  // ==========================================
  // FIND RELATED COST GUIDE
  // ==========================================

  const relatedGuide = guides.find(
    (guide) => guide.calculatorSlug === c.slug
  );

  // ==========================================
  // RELATED CALCULATORS
  // ==========================================

  const relatedCalculators = calculators
    .filter((calculator) => calculator.slug !== c.slug)
    .sort((a, b) => {
      const aMatch = a.category === c.category ? 1 : 0;
      const bMatch = b.category === c.category ? 1 : 0;

      return bMatch - aMatch;
    })
    .slice(0, 4);

  // ==========================================
  // SEO STRUCTURED DATA
  // ==========================================

  const webPageSchema = {
    "@type": "WebPage",

    "@id": `${currentUrl}#webpage`,

    name: c.title,

    description: c.description,

    url: currentUrl,

    inLanguage: "en",

    isPartOf: {
      "@type": "WebSite",
      name: brand.name,
      url: siteUrl,
    },

    breadcrumb: {
      "@id": `${currentUrl}#breadcrumb`,
    },

    mainEntity: {
      "@id": `${currentUrl}#application`,
    },
  };

  // ==========================================
  // WEB APPLICATION SCHEMA
  // ==========================================

  const applicationSchema = {
    "@type": "WebApplication",

    "@id": `${currentUrl}#application`,

    name: c.title,

    description: c.description,

    url: currentUrl,

    applicationCategory: "UtilitiesApplication",

    operatingSystem: "Any",

    browserRequirements:
      "Requires a modern web browser",

    isAccessibleForFree: true,

    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },

    inLanguage: "en",
  };

  // ==========================================
  // BREADCRUMB STRUCTURED DATA
  // ==========================================

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",

    "@id": `${currentUrl}#breadcrumb`,

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Calculators",
        item: `${siteUrl}/calculators`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: c.title,
        item: currentUrl,
      },
    ],
  };

  // ==========================================
  // FAQ STRUCTURED DATA
  // ==========================================

  const faqSchema = {
    "@type": "FAQPage",

    "@id": `${currentUrl}#faq`,

    mainEntity: c.faq.map((faq) => ({
      "@type": "Question",

      name: faq.q,

      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  // Combine all supported structured data
  const structuredData = {
    "@context": "https://schema.org",

    "@graph": [
      webPageSchema,
      applicationSchema,
      breadcrumbSchema,
      ...(c.faq.length > 0 ? [faqSchema] : []),
    ],
  };

  // ==========================================
  // PAGE UI
  // ==========================================

  return (
    <div className="calculator-page">

      {/* =====================================
          STRUCTURED DATA
      ===================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(structuredData),
        }}
      />

      {/* =====================================
          CALCULATOR HERO
      ===================================== */}

      <div className="container calc-hero">

        <Link
          href="/calculators"
          className="back-link"
        >
          <ArrowLeft
            size={15}
            aria-hidden="true"
          />

          All calculators
        </Link>

        <div className="calc-title-row">

          <span
            className="calc-hero-icon"
            aria-hidden="true"
          >
            {c.icon}
          </span>

          <div>

            <span className="eyebrow">
              {c.category.toUpperCase()} CALCULATOR
            </span>

            <h1>{c.title}</h1>

            <p>{c.description}</p>

          </div>

        </div>

      </div>

      {/* =====================================
          MAIN CALCULATOR
      ===================================== */}

      <div className="container">

        <CalculatorClient
          calculatorSlug={c.slug}
        />

      </div>

      {/* =====================================
          ADVERTISEMENT
      ===================================== */}

      <div className="container">
        <AdSlot />
      </div>

      {/* =====================================
          CALCULATOR INFORMATION
      ===================================== */}

      <section className="container calc-content-grid">

        <article className="prose-card">

          <span className="eyebrow">
            HOW IT WORKS
          </span>

          <h2>
            Plan the quantity before you shop
          </h2>

          <p>{c.intro}</p>

          {/* ASSUMPTIONS */}

          <h3>
            Assumptions in this calculator
          </h3>

          <ul className="check-list">

            {c.assumptions.map((assumption) => (

              <li key={assumption}>

                <CheckCircle2
                  size={17}
                  aria-hidden="true"
                />

                {assumption}

              </li>

            ))}

          </ul>

          {/* BETTER ESTIMATE TIPS */}

          <h3>Better-estimate tips</h3>

          <ol>

            {c.tips.map((tip) => (

              <li key={tip}>
                {tip}
              </li>

            ))}

          </ol>

          {/* RELATED GUIDE */}

          {relatedGuide && (

            <Link
              className="inline-cta"
              href={`/guides/${relatedGuide.slug}`}
            >

              Read the full planning guide

              <ArrowRight
                size={16}
                aria-hidden="true"
              />

            </Link>

          )}

          {/* ESTIMATE DISCLAIMER */}

          <p className="estimate-disclaimer">
            Estimates are for planning purposes.
            Verify measurements, local prices,
            regulations, and installation requirements
            before purchasing materials.
          </p>

        </article>

        {/* ===================================
            FAQ SECTION
        =================================== */}

        <aside
          className="faq-card"
          aria-label="Frequently asked questions"
        >

          <span className="eyebrow">
            QUICK ANSWERS
          </span>

          <h2>FAQ</h2>

          {c.faq.map((faq) => (

            <details key={faq.q}>

              <summary>{faq.q}</summary>

              <p>{faq.a}</p>

            </details>

          ))}

        </aside>

      </section>

      {/* =====================================
          RELATED CALCULATORS
      ===================================== */}

      <section className="container related-tools">

        <div className="section-heading">

          <div>

            <span className="eyebrow">
              RELATED PROJECT TOOLS
            </span>

            <h2>Keep planning</h2>

          </div>

          <Link
            href="/calculators"
            className="text-link"
          >
            View all calculators

            <ArrowRight
              size={16}
              aria-hidden="true"
            />

          </Link>

        </div>

        <div className="compact-tool-row">

          {relatedCalculators.map((calculator) => (

            <Link
              key={calculator.slug}
              href={`/calculators/${calculator.slug}`}
            >

              <span aria-hidden="true">
                {calculator.icon}
              </span>

              <div>

                <strong>
                  {calculator.shortTitle}
                </strong>

                <small>
                  {calculator.category}
                </small>

              </div>

              <ArrowRight
                size={16}
                aria-hidden="true"
              />

            </Link>

          ))}

        </div>

      </section>

    </div>
  );
}