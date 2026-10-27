import type { CalculatorDefinition, SavedEstimate } from './types';

export const STORAGE_KEY = 'home-project-calculator-estimates-v1';
export type CurrencyCode = 'USD' | 'GBP' | 'CAD';
export type UnitSystem = 'imperial' | 'metric';

const factors: Record<string, { factor: number; metric: string }> = {
  ft: { factor: 0.3048, metric: 'm' },
  in: { factor: 2.54, metric: 'cm' },
  'sq ft': { factor: 0.09290304, metric: 'm²' },
  'cu ft': { factor: 0.0283168466, metric: 'm³' },
  mi: { factor: 1.609344, metric: 'km' },
};
export function unitLabel(unit: string | undefined, system: UnitSystem, currency: CurrencyCode): string {
  if (!unit) return '';
  if (unit.startsWith('$')) return unit.replace('$', currency === 'GBP' ? '£' : currency === 'CAD' ? 'CA$' : '$');
  return system === 'metric' ? factors[unit]?.metric ?? unit : unit;
}
export function convertInput(value: number, unit: string | undefined, from: UnitSystem, to: UnitSystem): number {
  if (from === to || !unit || !factors[unit]) return value;
  return from === 'imperial' ? value * factors[unit].factor : value / factors[unit].factor;
}
export function displayResult(value: string, currency: CurrencyCode): string {
  if (currency === 'USD') return value;
  return value.replace(/\$/g, currency === 'GBP' ? '£' : 'CA$');
}
export function displayMeasuredResult(value: string, currency: CurrencyCode, system: UnitSystem): string {
  const localized = displayResult(value, currency);
  if (system !== 'metric' || /[$£]/.test(localized)) return localized;
  const match = localized.match(/^([\d,.]+)\s+(sq ft|cu ft|yd³|ft|in|mi|gal|tons)$/);
  if (!match) return localized;
  const input = Number(match[1].replace(/,/g, ''));
  const unitMap: Record<string, [number,string]> = {
    'sq ft': [0.09290304,'m²'], 'cu ft':[0.0283168466,'m³'],
    'yd³':[0.764554858,'m³'], ft:[0.3048,'m'],in:[2.54,'cm'],
    mi:[1.609344,'km'],gal:[3.785411784,'L'],tons:[0.90718474,'metric tons'],
  };
  const conversion = unitMap[match[2]];
  return conversion ? `${(input*conversion[0]).toLocaleString('en-US',{maximumFractionDigits:3})} ${conversion[1]}` : localized;
}
export function safeReadEstimates(): SavedEstimate[] {
  if (typeof window === 'undefined') return [];
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(data)) return [];
    return data.filter((x): x is SavedEstimate => Boolean(x && typeof x === 'object' && typeof x.id === 'string' && typeof x.calculatorSlug === 'string' && x.values && typeof x.values === 'object' && !Array.isArray(x.values)));
  } catch { return []; }
}
export function saveEstimates(items: SavedEstimate[]): boolean {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 60))); return true; }
  catch { return false; }
}
export function validateInputs(calculator: CalculatorDefinition, values: Record<string, string | number>, unitSystem: UnitSystem = 'imperial'): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of calculator.fields) {
    if (field.type === 'select') {
      if (!field.options?.some(option => option.value === String(values[field.key]))) errors[field.key] = 'Please choose a valid option.';
      continue;
    }
    const raw = values[field.key];
    const parsed = Number(raw);
    if (raw === '' || raw === undefined || !Number.isFinite(parsed)) { errors[field.key] = 'Enter a valid number.'; continue; }
    if (parsed < 0) { errors[field.key] = 'Negative values are not allowed.'; continue; }
    const normalized = convertInput(parsed, field.unit, unitSystem, 'imperial');
    if (field.max !== undefined && normalized > field.max + 0.00001) errors[field.key] = `Maximum is ${field.max} (${unitLabel(field.unit, 'imperial', 'USD')}).`;
    // Zero is allowed initially; nonzero inputs must respect the field minimum.
    if (normalized > 0 && field.min !== undefined && normalized + 0.00001 < field.min) errors[field.key] = `Minimum is ${field.min} ${unitLabel(field.unit, 'imperial', 'USD')}.`;
    if (field.step === 1 && !Number.isInteger(parsed)) errors[field.key] = 'Enter a whole number.';
  }
  return errors;
}
export function hasPartialMeasurements(calculator: CalculatorDefinition, values: Record<string, number | string>): boolean {
  const meaningful = calculator.fields.filter(f => f.type === 'number' && (f.min ?? 0) > 0 && !(f.unit || '').startsWith('$'));
  return meaningful.some(f => Number(values[f.key]) > 0) && meaningful.some(f => Number(values[f.key]) === 0);
}
export function amountFromResult(results: {label:string;value:string}[]): number {
  const candidates = results.filter(r => /(?:cost|budget|total)/i.test(r.label) && /\$/.test(r.value));
  const best = candidates.at(-1);
  if (!best) return 0;
  const match = best.value.replace(/,/g, '').match(/\$\s*(-?\d+(?:\.\d+)?)/);
  return match ? Math.max(0, Number(match[1])) : 0;
}
export function moneyInCurrency(value: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number.isFinite(value) ? value : 0);
}
