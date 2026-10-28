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

const calculatorSeo: Record<
  string,
  { title: string; description: string }
> = {
  "paint-calculator": {
    title: "Free Paint Calculator – Estimate Paint Needed",
    description:
      "Estimate how much paint you need for your project. Plan wall coverage, paint quantities, and supplies with our free paint calculator.",
  },
  "flooring-calculator": {
    title: "Flooring Calculator – Estimate Area & Cost",
    description:
      "Calculate flooring area and estimate material costs. Plan flooring quantities, waste allowances, and your project budget.",
  },
  "tile-calculator": {
    title: "Free Tile Calculator – Estimate Tiles Needed",
    description:
      "Estimate how many tiles you need for floors or walls. Calculate coverage and plan extra materials for cuts and waste.",
  },
  "concrete-calculator": {
    title: "Concrete Calculator – Estimate Concrete Volume",
    description:
      "Estimate the concrete volume needed for your project using dimensions. Plan concrete quantities before placing an order.",
  },
  "gravel-calculator": {
    title: "Gravel Calculator – Estimate Gravel Quantity",
    description:
      "Calculate how much gravel your project needs. Estimate material quantities for driveways, paths, and landscaping.",
  },
  "fence-calculator": {
    title: "Fence Calculator – Estimate Fence Materials",
    description:
      "Plan your fencing project with a free fence calculator. Estimate fence measurements and required materials.",
  },
  "deck-calculator": {
    title: "Deck Calculator – Estimate Decking Materials",
    description:
      "Estimate decking materials for your outdoor project. Plan deck dimensions, material quantities, and costs.",
  },
  "roofing-calculator": {
    title: "Roofing Calculator – Estimate Roof Materials",
    description:
      "Estimate roof area and roofing material quantities. Plan waste allowances and materials for your roofing project.",
  },
  "moving-cost-calculator": {
    title: "Moving Cost Calculator – Estimate Moving Expenses",
    description:
      "Estimate moving expenses and plan your relocation budget using our free online moving cost calculator.",
  },
  "electricity-cost-calculator": {
    title: "Electricity Cost Calculator – Estimate Energy Costs",
    description:
      "Estimate electricity costs based on energy consumption and rates. Plan appliance usage and household energy expenses.",
  },
  "mulch-soil-calculator": {
    title: "Mulch & Soil Calculator – Estimate Materials",
    description:
      "Estimate mulch and soil quantities for your garden or landscaping project. Plan coverage, depth, and material needs.",
  },
  "renovation-budget-calculator": {
    title: "Renovation Budget Calculator – Estimate Costs",
    description:
      "Plan your home renovation budget. Estimate project expenses, allocate costs, and prepare for unexpected spending.",
  },
  "drywall-calculator": {
    title: "Drywall Calculator – Estimate Drywall Sheets",
    description:
      "Estimate drywall material quantities for walls and ceilings. Plan sheet coverage and project requirements.",
  },
  "wallpaper-calculator": {
    title: "Wallpaper Calculator – Estimate Wallpaper Rolls",
    description:
      "Estimate wallpaper requirements for your room. Plan wall coverage and wallpaper quantities before buying materials.",
  },
  "paver-calculator": {
    title: "Paver Calculator – Estimate Pavers Needed",
    description:
      "Estimate paver quantities for patios, pathways, and outdoor surfaces. Plan project coverage and material needs.",
  },
};

// Worked examples match the default values in lib/calculators.ts.
// These examples are informational and do not change calculator logic.
type CalculatorExample = {
  title: string;
  steps: string[];
  result: string;
  note: string;
};

const calculatorExamples: Record<string, CalculatorExample> = {
  "paint-calculator": {
    title: "Paint Calculator: Worked Example",
    steps: [
      "For a 14 ft × 12 ft room with 8 ft walls, the perimeter is 2 × (14 + 12) = 52 ft.",
      "Gross wall area = 52 × 8 = 416 sq ft.",
      "Subtract one 20 sq ft door and two 15 sq ft windows: 416 − 50 = 366 sq ft.",
      "For two coats, the area to cover is 366 × 2 = 732 sq ft.",
      "Add 10% waste: 732 × 1.10 = 805.2 sq ft.",
      "At 350 sq ft per gallon, 805.2 ÷ 350 ≈ 2.30 gallons; round up to 3 gallons.",
      "At $45 per gallon, the estimated paint purchase cost is 3 × $45 = $135.",
    ],
    result: "Estimated purchase: 3 gallons of paint for $135.",
    note: "Example based on default inputs, not a live quote. Primer, labor and surface preparation are excluded; verify coverage on the paint label.",
  },
  "flooring-calculator": {
    title: "Flooring Calculator: Worked Example",
    steps: [
      "For a rectangular room measuring 16 ft × 12 ft, floor area = 192 sq ft.",
      "Add a 10% waste allowance: 192 × 1.10 = 211.2 sq ft.",
      "If a box covers 22.5 sq ft, 211.2 ÷ 22.5 ≈ 9.39 boxes.",
      "Round up to 10 whole boxes, providing 225 sq ft of purchased coverage.",
      "At $58 per box, the material estimate is 10 × $58 = $580.",
    ],
    result: "Estimated purchase: 10 flooring boxes for $580.",
    note: "Example based on default inputs. Underlayment, trim, labor and taxes are not included. Check your flooring product's box coverage.",
  },
  "concrete-calculator": {
    title: "Concrete Calculator: Worked Example",
    steps: [
      "For a slab measuring 20 ft × 10 ft and 4 inches thick, convert thickness: 4 ÷ 12 = 0.3333 ft.",
      "Concrete volume = 20 × 10 × (4 ÷ 12) ≈ 66.67 cubic feet.",
      "Convert to cubic yards: 66.67 ÷ 27 ≈ 2.47 yd³.",
      "Allow 10% extra: (20 × 10 × (4 ÷ 12) ÷ 27) × 1.10 ≈ 2.72 yd³.",
      "At $165 per yd³, estimated ready-mix material cost ≈ $448.15.",
    ],
    result: "Estimated order volume: 2.72 yd³; ready-mix material estimate: $448.15.",
    note: "Example based on default inputs. Actual ordering may require supplier increments, minimum loads, delivery charges, reinforcement and labor. Use engineered requirements for structural work.",
  },
};

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

  const seo = calculatorSeo[calculator.slug];

  const title =
    seo?.title ??
    `${calculator.title} – Free Project Estimator`;

  const description =
    seo?.description ?? calculator.description;

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
  const pageDescription = calculatorSeo[c.slug]?.description ?? c.description;

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

    description: pageDescription,

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

    description: pageDescription,

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

          <h2>How to use the {c.title}</h2>

          <p>{c.intro}</p>

          {/* Worked examples are shown only where the formula is verified. */}
          {calculatorExamples[c.slug] && (
            <section aria-label="Worked calculation example">
              <h3>{calculatorExamples[c.slug].title}</h3>
              <p>
                This worked example uses the calculator's default values so
                you can follow the calculation before entering your own figures.
              </p>
              <ol>
                {calculatorExamples[c.slug].steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p>
                <strong>{calculatorExamples[c.slug].result}</strong>
              </p>
              <p className="estimate-disclaimer">
                {calculatorExamples[c.slug].note}
              </p>
            </section>
          )}

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