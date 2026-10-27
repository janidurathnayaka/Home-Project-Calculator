export type FieldOption = { label: string; value: string };

export type CalculatorField = {
  key: string;
  label: string;
  type: 'number' | 'select';
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  help?: string;
  options?: FieldOption[];
};

export type CalculatorResult = {
  label: string;
  value: string;
  emphasis?: boolean;
};

export type CalculatorDefinition = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  icon: string;
  description: string;
  intro: string;
  fields: CalculatorField[];
  assumptions: string[];
  tips: string[];
  faq: { q: string; a: string }[];
  calculate: (values: Record<string, number | string>) => CalculatorResult[];
};

export type SavedEstimate = {
  id: string;
  calculatorSlug: string;
  calculatorTitle: string;
  createdAt: string;
  values: Record<string, number | string>;
  results: CalculatorResult[];
  name?: string;
  currency?: 'USD' | 'GBP' | 'CAD';
  unitSystem?: 'imperial' | 'metric';
  labor?: number;
  delivery?: number;
  taxPercent?: number;
  contingencyPercent?: number;
};
