
import type { CalculatorDefinition } from './types';
import { ceil, money } from './format';

/**
 * Upgrade only the fence calculator.
 * A zero gate width preserves the original calculation,
 * including estimates saved before this update.
 */
export function enhanceFenceCalculator(
  calculator: CalculatorDefinition
): CalculatorDefinition {
  if (calculator.slug !== 'fence-calculator') {
    return calculator;
  }

  const gateWidthField = {
    key: 'gateWidth',
    label: 'Gate opening width (each)',
    type: 'number' as const,
    defaultValue: 0,
    min: 0,
    step: 0.5,
    unit: 'ft',
    help: 'Optional. Leave at 0 for the original estimate. Enter the opening width to deduct gate space from fence panels.',
  };

  return {
    ...calculator,

    intro:
      'Estimate panels, posts, gates, and material costs for a straight fence. ' +
      'Optionally enter gate opening width to reduce the length covered by panels. ' +
      'Post quantities remain planning estimates.',

    fields: calculator.fields.flatMap((field) =>
      field.key === 'gates'
        ? [field, gateWidthField]
        : [field]
    ),

    assumptions: [
      'Gate opening width of zero preserves the original estimating method.',
      'When gate width is entered, gate openings are deducted from the panel length.',
      'Post counts are approximate for a straight run. Actual gate locations and corners may require different posts.',
      'Gate hardware, concrete, delivery, tax, and labor may be additional.',
    ],

    calculate: (values) => {
      const read = (key: string): number => {
        const value = Number(values[key] ?? 0);
        return Number.isFinite(value) ? Math.max(0, value) : 0;
      };

      const length = read('length');
      const panelWidth = Math.max(read('panelWidth'), 0.1);
      const postSpacing = read('postSpacing');

      const gates = Math.floor(read('gates'));
      const gateWidth = read('gateWidth');
      const allowance = read('waste');

      const totalGateWidth = gates * gateWidth;

      const useGateOpenings = gates > 0 && gateWidth > 0;

      const solidFenceLength = useGateOpenings
        ? Math.max(0, length - totalGateWidth)
        : length;

      const panels = ceil(
        (solidFenceLength / panelWidth) *
        (1 + allowance / 100)
      );

      let posts = 0;

      if (length > 0 && postSpacing > 0) {
        if (useGateOpenings) {
          // Planning approximation: fence spans, end posts,
          // and additional boundaries formed by gate openings.
          posts =
            solidFenceLength > 0
              ? ceil(solidFenceLength / postSpacing) +
                gates +
                1
              : gates * 2;
        } else {
          // Preserve legacy results for zero gate width.
          posts =
            ceil(length / postSpacing) +
            1 +
            gates * 2;
        }
      }

      const materialCost =
        panels * read('panelPrice') +
        posts * read('postPrice') +
        gates * read('gatePrice');

      return [
        {
          label: 'Fence panels / sections',
          value: String(panels),
          emphasis: true,
        },
        {
          label: 'Estimated posts',
          value: String(posts),
        },
        {
          label: 'Gates',
          value: String(gates),
        },
        {
          label: 'Estimated listed-material cost',
          value: money(materialCost),
          emphasis: true,
        },
      ];
    },
  };
}
