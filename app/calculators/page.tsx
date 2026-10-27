import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, Calculator, CheckCircle2 } from 'lucide-react';
import CalculatorCard from '@/components/CalculatorCard';
import CalculatorSearch from '@/components/CalculatorSearch';
import { calculators } from '@/lib/calculators';

export const metadata: Metadata = {
  title: 'Home Improvement Calculators',
  description: 'Free paint, flooring, tile, concrete, gravel, fence, deck, roofing, moving, energy, landscape, and renovation calculators.'
};

const categoryDescriptions: Record<string, string> = {
  Interior: 'Paint, floors and surfaces for rooms inside the home.',
  Outdoor: 'Materials for yards, driveways, fences and outdoor structures.',
  Exterior: 'Exterior project quantities for weather-facing parts of the home.',
  Planning: 'Budget and moving tools for bigger project decisions.',
  Energy: 'Estimate everyday operating costs before you spend.',
  Garden: 'Plan soil, mulch and landscape materials with less guesswork.',
};

export default function CalculatorsPage() {
  const categories = [...new Set(calculators.map(c => c.category))];

  return (
    <div className="calculator-directory-page">
      <section className="directory-hero">
        <div className="container directory-hero-grid">
          <div>
            <span className="eyebrow">FREE PROJECT TOOLS</span>
            <h1>Plan the materials.<br/>Know the budget.</h1>
            <p>Practical calculators for common home projects, with editable local prices, visible assumptions, and shopping quantities that are easy to use.</p>
            <div className="directory-trust">
              <span><CheckCircle2 size={15}/> No account needed</span>
              <span><CheckCircle2 size={15}/> Local prices editable</span>
              <span><CheckCircle2 size={15}/> Save estimates</span>
            </div>
          </div>

          <div className="directory-summary">
            <span className="directory-summary-icon"><Calculator size={22}/></span>
            <strong>{calculators.length}</strong>
            <p>calculators covering common interior, exterior, outdoor, garden, energy and planning projects.</p>
            <a href="#calculator-directory" className="directory-jump">Choose a project <ArrowDown size={15}/></a>
          </div>
        </div>
      </section>

      <div className="container"><CalculatorSearch /></div>
      <section className="container category-nav-wrap" aria-label="Calculator categories">
        <span>Jump to</span>
        <div className="category-nav">
          {categories.map(category => (
            <a key={category} href={`#${category.toLowerCase()}`}>{category}</a>
          ))}
        </div>
      </section>

      <main id="calculator-directory" className="container calculator-directory">
        {categories.map((category, categoryIndex) => {
          const categoryCalculators = calculators.filter(c => c.category === category);
          const offset = calculators.findIndex(c => c.category === category);

          return (
            <section className="directory-category" id={category.toLowerCase()} key={category}>
              <div className="directory-category-head">
                <div className="directory-category-title">
                  <span>{String(categoryIndex + 1).padStart(2, '0')}</span>
                  <div>
                    <h2>{category}</h2>
                    <p>{categoryDescriptions[category]}</p>
                  </div>
                </div>
                <Link href={`/calculators/${categoryCalculators[0].slug}`} className="category-first-link">
                  {categoryCalculators.length} tool{categoryCalculators.length > 1 ? 's' : ''}
                </Link>
              </div>

              <div className="directory-grid">
                {categoryCalculators.map((calculator, index) => (
                  <CalculatorCard
                    key={calculator.slug}
                    calculator={calculator}
                    index={offset + index}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
