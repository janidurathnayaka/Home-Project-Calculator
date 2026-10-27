export const money = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(Number.isFinite(value) ? value : 0);

export const number = (value: number, digits = 1) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);

export const ceil = (value: number) => Math.ceil(Number.isFinite(value) ? value - 1e-9 : 0);
