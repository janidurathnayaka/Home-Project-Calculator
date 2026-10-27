import Link from 'next/link';
import { ArrowUpRight, Calculator, Hammer, Ruler, Wrench } from 'lucide-react';
import { CalculatorDefinition } from '@/lib/types';

type Props = {
  calculator: CalculatorDefinition;
  index?: number;
  featured?: boolean;
};

const categoryIcons = {
  Interior: Ruler,
  Outdoor: Wrench,
  Exterior: Hammer,
  Planning: Calculator,
  Energy: Calculator,
  Garden: Wrench,
};

export default function CalculatorCard({ calculator, index = 0, featured = false }: Props) {
  const Icon = categoryIcons[calculator.category as keyof typeof categoryIcons] ?? Calculator;
  const number = String(index + 1).padStart(2, '0');

  return (
    <Link
      href={`/calculators/${calculator.slug}`}
      className={featured ? 'project-card project-card-featured' : 'project-card'}
    >
      <div className="project-card-accent" />

      <div className="project-card-head">
        <span className="project-card-number">{number}</span>
        <span className="project-card-category">{calculator.category}</span>
      </div>

      <div className="project-card-body">
        <span className="project-card-icon" aria-hidden="true">
          <Icon size={21} strokeWidth={1.9} />
        </span>
        <h3>{calculator.title}</h3>
        <p>{calculator.description}</p>
      </div>

      <div className="project-card-footer">
        <span className="project-card-note">Materials · quantity · cost</span>
        <span className="project-card-open">Calculate <ArrowUpRight size={16} /></span>
      </div>
    </Link>
  );
}
