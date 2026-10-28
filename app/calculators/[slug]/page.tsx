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

// Illustrative worked examples use sample values, not prefilled inputs.
// They explain existing calculation formulas without changing calculator logic.
type CalculatorExample = {
  title: string;
  steps: string[];
  result: string;
  note: string;
};

const calculatorExamples: Record<string, CalculatorExample> = {

  "tile-calculator": {
    title: "Tile Calculator: Worked Example",
    steps: [
      "For a 10 ft × 8 ft rectangular surface, multiply 10 × 8 = 80 sq ft.",
      "Add 12% waste for cuts and breakage: 80 × 1.12 = 89.6 sq ft.",
      "With 15.5 sq ft per tile box, 89.6 ÷ 15.5 ≈ 5.78 boxes.",
      "Round up to 6 complete boxes. At $42 per box, 6 × $42 = $252.",
    ],
    result: "Illustrative order: 6 boxes; estimated tile material cost $252.",
    note: "Sample inputs, not a quote. Thinset, grout, backer board, labor and tax are excluded. Check package coverage and pattern waste.",
  },
  "gravel-calculator": {
    title: "Gravel Calculator: Worked Example",
    steps: [
      "A 40 ft × 10 ft area at 3 inches deep contains 40 × 10 × (3 ÷ 12) = 100 cu ft.",
      "Convert to cubic yards: 100 ÷ 27 ≈ 3.70 yd³.",
      "Add 8% extra: (100 ÷ 27) × 1.08 = 4.00 yd³.",
      "At 1.4 tons per cubic yard, the order is 4.00 × 1.4 = 5.60 tons.",
      "At $55 per ton, the material estimate is 5.60 × $55 = $308.",
    ],
    result: "Illustrative order: 5.60 tons; estimated material cost $308.",
    note: "Actual stone density, compaction, minimum deliveries and grading work vary. Ask your supplier for product-specific density.",
  },
  "fence-calculator": {
    title: "Fence Calculator: Worked Example",
    steps: [
      "For a 120 ft fence using 8 ft sections, 120 ÷ 8 = 15 sections before waste.",
      "Add 5% extra and round up: ceil(15 × 1.05) = 16 panels.",
      "With 8 ft post spacing and one gate, posts = ceil(120 ÷ 8) + 1 + (1 × 2) = 18.",
      "Panels cost 16 × $95 = $1,520; posts cost 18 × $28 = $504.",
      "Add one $180 gate: estimated listed-material cost = $2,204.",
    ],
    result: "Illustrative materials: 16 panels, 18 posts, 1 gate; $2,204.",
    note: "The current model does not deduct gate width from fence length. Site corners, special posts, concrete, hardware and labor may change the result.",
  },
  "deck-calculator": {
    title: "Deck Calculator: Worked Example",
    steps: [
      "For a 16 ft × 12 ft deck, surface area = 16 × 12 = 192 sq ft.",
      "Add 10% waste: 192 × 1.10 = 211.2 sq ft.",
      "An actual 5.5-inch board with a 0.125-inch gap spans (5.5 + 0.125) ÷ 12 = 0.46875 ft of width.",
      "Estimated decking length = 211.2 ÷ 0.46875 ≈ 451 linear feet.",
      "At $7.50 per sq ft of adjusted deck area, 211.2 × $7.50 = $1,584.",
    ],
    result: "Illustrative decking: about 451 linear feet; surface material $1,584.",
    note: "Board lengths and cutting layout affect actual purchasing. Framing, railings, footings, stairs, fasteners and labor are not included.",
  },
  "roofing-calculator": {
    title: "Roofing Calculator: Worked Example",
    steps: [
      "A 50 ft × 30 ft building has a 1,500 sq ft horizontal footprint.",
      "Using a 6:12 pitch factor of 1.118, roof area ≈ 1,500 × 1.118 = 1,677 sq ft.",
      "Add 12% waste: 1,677 × 1.12 = 1,878.24 sq ft, or about 18.78 roofing squares.",
      "At 3 bundles per square, round 18.7824 × 3 up to 57 bundles.",
      "At $42 per bundle, estimated shingle cost is 57 × $42 = $2,394.",
    ],
    result: "Illustrative order: 57 shingle bundles; estimated shingle cost $2,394.",
    note: "A simple roof footprint is only an early estimate; complex roof planes, ridge caps, underlayment, flashing and labor require separate takeoffs. Roof work carries fall risk.",
  },
  "moving-cost-calculator": {
    title: "Moving Cost Calculator: Worked Example",
    steps: [
      "Six crew hours at $165 per hour gives labor of 6 × $165 = $990.",
      "Twenty-five billable miles at $2.50 per mile add $62.50.",
      "Add a $125 truck fee, $150 packing allowance and $75 other extras.",
      "Subtotal = $990 + $62.50 + $125 + $150 + $75 = $1,402.50.",
      "With 10% contingency, budget = $1,402.50 × 1.10 = $1,542.75 (shown rounded as $1,543).",
    ],
    result: "Illustrative moving budget: $1,543 as displayed (unrounded $1,542.75).",
    note: "Use itemized quotes from real movers. Taxes, tips, valuation coverage, storage and stairs or long-carry fees may be extra.",
  },
  "electricity-cost-calculator": {
    title: "Electricity Cost Calculator: Worked Example",
    steps: [
      "A 1,500 W appliance used 4 hours per day consumes (1,500 × 4) ÷ 1,000 = 6 kWh daily.",
      "Over 30 days, monthly consumption = 6 × 30 = 180 kWh.",
      "At $0.18 per kWh, estimated monthly energy charge = 180 × $0.18 = $32.40.",
      "If use stays the same every month, 12 months would cost $388.80 (shown rounded as $389).",
    ],
    result: "Illustrative electricity expense: $32.40/month or about $389/year.",
    note: "This assumes constant power draw. Utility fixed charges, taxes, tiered rates and cycling appliances can change actual bills.",
  },
  "mulch-soil-calculator": {
    title: "Mulch and Soil Calculator: Worked Example",
    steps: [
      "For a 30 ft × 8 ft garden bed at 3 inches deep, volume = 30 × 8 × (3 ÷ 12) = 60 cu ft.",
      "Add 5% extra for settling and handling: 60 × 1.05 = 63 cu ft.",
      "In cubic yards, 63 ÷ 27 ≈ 2.33 yd³.",
      "At 2 cu ft per bag, ceil(63 ÷ 2) = 32 bags.",
      "With bags priced at $4.98 each, bagged material cost = 32 × $4.98 = $159.36 (shown rounded as $159).",
    ],
    result: "Illustrative order: 32 bags; estimated bag cost $159 as displayed (unrounded $159.36).",
    note: "Bulk deliveries are priced differently. Keep mulch clear of trunks and siding and account for grade and drainage.",
  },
  "renovation-budget-calculator": {
    title: "Renovation Budget Calculator: Worked Example",
    steps: [
      "At 500 sq ft with a $150/sq ft construction allowance, base construction = $75,000.",
      "Add 8% design and professional fees: $75,000 × 0.08 = $6,000.",
      "Add $1,500 for permits: subtotal = $75,000 + $6,000 + $1,500 = $82,500.",
      "Add 15% contingency: $82,500 × 0.15 = $12,375.",
      "Total planning budget = $82,500 + $12,375 = $94,875.",
    ],
    result: "Illustrative renovation planning budget: $94,875.",
    note: "This is a high-level scenario, not a contractor bid. Location, scope, finishes, codes, hidden damage and schedule can change costs substantially.",
  },
  "drywall-calculator": {
    title: "Drywall Calculator: Worked Example",
    steps: [
      "Illustrative inputs: 40 ft of total wall length at 8 ft high, one door and two windows.",
      "Gross area = 40 × 8 = 320 sq ft; openings = 20 + (2 × 15) = 50 sq ft.",
      "Net wall area = 320 − 50 = 270 sq ft.",
      "With 10% cutting waste, adjusted area = 270 × 1.10 = 297 sq ft.",
      "For 32 sq ft per sheet, ceil(297 ÷ 32) = 10 sheets; at $15 per sheet, cost = $150.",
    ],
    result: "Illustrative purchase: 10 drywall sheets; sheet cost $150.",
    note: "These are example inputs, not prefilled values. Tape, joint compound, screws, special-rated boards and labor are excluded.",
  },
  "wallpaper-calculator": {
    title: "Wallpaper Calculator: Worked Example",
    steps: [
      "Illustrative inputs: 40 ft total wall length, 8 ft height, one door and two windows.",
      "Net coverage = (40 × 8) − 20 − (2 × 15) = 270 sq ft.",
      "Add 15% for pattern matching: 270 × 1.15 = 310.5 sq ft.",
      "If usable coverage per roll is 50 sq ft, ceil(310.5 ÷ 50) = 7 rolls.",
      "At $35 per roll, the material estimate is 7 × $35 = $245.",
    ],
    result: "Illustrative purchase: 7 wallpaper rolls; material cost $245.",
    note: "Example inputs are not prefilled values. Real strip lengths, pattern repeat, drop matching and dye lot affect the number of rolls.",
  },
  "paver-calculator": {
    title: "Paver Calculator: Worked Example",
    steps: [
      "Illustrative patio size: 12 ft × 10 ft = 120 sq ft.",
      "Each 8 in × 4 in paver covers (8 × 4) ÷ 144 ≈ 0.2222 sq ft, excluding joints.",
      "Allow 10% cuts and waste: 120 × 1.10 = 132 sq ft.",
      "Pavers needed = ceil(132 ÷ (32 ÷ 144)) = 594 individual pavers.",
      "At $1.50 each, the estimated paver cost is 594 × $1.50 = $891.",
    ],
    result: "Illustrative purchase: 594 pavers; material cost $891.",
    note: "Example inputs are not prefilled values. Joint spacing, pattern layout, base gravel, edge restraint and labor are excluded.",
  },

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
    note: "Illustrative sample, not a live quote. Primer, labor and surface preparation are excluded; verify coverage on the paint label.",
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
    note: "Illustrative sample inputs. Underlayment, trim, labor and taxes are not included. Check your flooring product's box coverage.",
  },
  "concrete-calculator": {
    title: "Concrete Calculator: Worked Example",
    steps: [
      "For a slab measuring 20 ft × 10 ft and 4 inches thick, convert thickness: 4 ÷ 12 = 0.3333 ft.",
      "Concrete volume = 20 × 10 × (4 ÷ 12) ≈ 66.67 cubic feet.",
      "Convert to cubic yards: 66.67 ÷ 27 ≈ 2.47 yd³.",
      "Allow 10% extra: (20 × 10 × (4 ÷ 12) ÷ 27) × 1.10 ≈ 2.72 yd³.",
      "At $165 per yd³, estimated ready-mix material cost ≈ $448.15 (shown rounded as $448).",
    ],
    result: "Estimated order volume: 2.72 yd³; ready-mix cost about $448 as displayed (unrounded $448.15).",
    note: "Illustrative sample inputs. Actual ordering may require supplier increments, minimum loads, delivery charges, reinforcement and labor. Use engineered requirements for structural work.",
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
                This illustrative worked example uses sample numbers to explain
                the calculation. Enter your own measurements and local prices
                for a project-specific estimate.
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