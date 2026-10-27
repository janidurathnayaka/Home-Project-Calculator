import { CalculatorDefinition } from './types';
import { ceil, money, number } from './format';

const n = (v: number | string) => Number(v) || 0;
const waste = (base: number, percent: number) => base * (1 + percent / 100);

export const calculators: CalculatorDefinition[] = [
  {
    slug: 'paint-calculator',
    title: 'Paint Calculator',
    shortTitle: 'Paint',
    category: 'Interior',
    icon: '🎨',
    description: 'Estimate wall area, paint gallons, and material cost for a room.',
    intro: 'Enter your room dimensions, openings, number of coats, coverage, and local paint price. The calculator adds a practical waste allowance so you can plan a shopping quantity.',
    fields: [
      { key: 'length', label: 'Room length', type: 'number', defaultValue: 14, min: 1, step: 0.5, unit: 'ft' },
      { key: 'width', label: 'Room width', type: 'number', defaultValue: 12, min: 1, step: 0.5, unit: 'ft' },
      { key: 'height', label: 'Wall height', type: 'number', defaultValue: 8, min: 4, step: 0.5, unit: 'ft' },
      { key: 'doors', label: 'Doors', type: 'number', defaultValue: 1, min: 0, step: 1, help: 'Uses 20 sq ft per door.' },
      { key: 'windows', label: 'Windows', type: 'number', defaultValue: 2, min: 0, step: 1, help: 'Uses 15 sq ft per window.' },
      { key: 'coats', label: 'Paint coats', type: 'number', defaultValue: 2, min: 1, max: 4, step: 1 },
      { key: 'coverage', label: 'Coverage per gallon', type: 'number', defaultValue: 350, min: 100, step: 10, unit: 'sq ft' },
      { key: 'waste', label: 'Waste allowance', type: 'number', defaultValue: 10, min: 0, max: 30, step: 1, unit: '%' },
      { key: 'price', label: 'Paint price', type: 'number', defaultValue: 45, min: 0, step: 1, unit: '$/gal' },
    ],
    assumptions: ['Door opening = 20 sq ft', 'Window opening = 15 sq ft', 'Coverage varies by paint, surface, and color change', 'Primer is not included'],
    tips: ['Use the coverage printed on your paint can for a better estimate.', 'Deep color changes and porous drywall may need extra coats.', 'Round up to full gallons so you have touch-up paint left.'],
    faq: [
      { q: 'How much does one gallon of paint cover?', a: 'Many interior paints cover roughly 300–400 sq ft per coat, but always use the manufacturer coverage for your product.' },
      { q: 'Should I subtract doors and windows?', a: 'Yes for a tighter estimate. This calculator uses standard opening sizes, but you can compensate by adjusting waste if your openings are unusually large.' },
    ],
    calculate: (v) => {
      const perimeter = 2 * (n(v.length) + n(v.width));
      const gross = perimeter * n(v.height);
      const openings = n(v.doors) * 20 + n(v.windows) * 15;
      const net = Math.max(gross - openings, 0);
      const coatedArea = net * Math.max(n(v.coats), 1);
      const adjusted = waste(coatedArea, n(v.waste));
      const gallons = adjusted / Math.max(n(v.coverage), 1);
      const buy = ceil(gallons);
      return [
        { label: 'Paintable wall area', value: `${number(net, 0)} sq ft` },
        { label: 'Area incl. coats + waste', value: `${number(adjusted, 0)} sq ft` },
        { label: 'Estimated paint needed', value: `${number(gallons, 2)} gal` },
        { label: 'Buy', value: `${buy} gallon${buy === 1 ? '' : 's'}`, emphasis: true },
        { label: 'Estimated paint cost', value: money(buy * n(v.price)), emphasis: true },
      ];
    },
  },
  {
    slug: 'flooring-calculator',
    title: 'Flooring Calculator',
    shortTitle: 'Flooring',
    category: 'Interior',
    icon: '🪵',
    description: 'Estimate floor area, waste, boxes, and flooring material cost.',
    intro: 'Use room dimensions and the box coverage shown by your flooring manufacturer to calculate how many boxes to buy.',
    fields: [
      { key: 'length', label: 'Room length', type: 'number', defaultValue: 16, min: 1, step: 0.5, unit: 'ft' },
      { key: 'width', label: 'Room width', type: 'number', defaultValue: 12, min: 1, step: 0.5, unit: 'ft' },
      { key: 'waste', label: 'Waste allowance', type: 'number', defaultValue: 10, min: 0, max: 30, step: 1, unit: '%' },
      { key: 'boxCoverage', label: 'Coverage per box', type: 'number', defaultValue: 22.5, min: 1, step: 0.1, unit: 'sq ft' },
      { key: 'boxPrice', label: 'Price per box', type: 'number', defaultValue: 58, min: 0, step: 1, unit: '$' },
    ],
    assumptions: ['Rectangular room', 'Waste covers cuts, defects, and future repairs', 'Underlayment, trim, labor, and tax excluded'],
    tips: ['Use 10% waste for simple layouts and more for diagonal patterns.', 'Buy all boxes from the same lot when color variation matters.', 'Keep one unopened box for future repairs when practical.'],
    faq: [
      { q: 'How much extra flooring should I buy?', a: 'A common planning allowance is about 7–10% for straightforward rooms and 12–15% for complex or diagonal layouts.' },
      { q: 'Why calculate by box?', a: 'Flooring is normally sold in full boxes, so the final shopping quantity must be rounded up.' },
    ],
    calculate: (v) => {
      const area = n(v.length) * n(v.width);
      const adjusted = waste(area, n(v.waste));
      const boxes = ceil(adjusted / Math.max(n(v.boxCoverage), 0.01));
      return [
        { label: 'Room area', value: `${number(area, 1)} sq ft` },
        { label: 'Area incl. waste', value: `${number(adjusted, 1)} sq ft` },
        { label: 'Boxes to buy', value: `${boxes}`, emphasis: true },
        { label: 'Material coverage bought', value: `${number(boxes * n(v.boxCoverage), 1)} sq ft` },
        { label: 'Estimated material cost', value: money(boxes * n(v.boxPrice)), emphasis: true },
      ];
    },
  },
  {
    slug: 'tile-calculator',
    title: 'Tile Calculator',
    shortTitle: 'Tile',
    category: 'Interior',
    icon: '▦',
    description: 'Calculate tile area, waste, boxes, and approximate tile cost.',
    intro: 'Plan floor or wall tile purchases using project area, box coverage, pattern waste, and your local box price.',
    fields: [
      { key: 'length', label: 'Surface length', type: 'number', defaultValue: 10, min: 1, step: 0.25, unit: 'ft' },
      { key: 'width', label: 'Surface width', type: 'number', defaultValue: 8, min: 1, step: 0.25, unit: 'ft' },
      { key: 'waste', label: 'Waste allowance', type: 'number', defaultValue: 12, min: 0, max: 35, step: 1, unit: '%' },
      { key: 'boxCoverage', label: 'Coverage per box', type: 'number', defaultValue: 15.5, min: 0.1, step: 0.1, unit: 'sq ft' },
      { key: 'boxPrice', label: 'Price per box', type: 'number', defaultValue: 42, min: 0, step: 1, unit: '$' },
    ],
    assumptions: ['Rectangular surface', 'Grout, mortar, backer board, trim, tax, and labor excluded'],
    tips: ['Large-format and patterned layouts can need more waste.', 'Check dye lot/caliber before mixing boxes.', 'Measure each separate area and add totals for irregular rooms.'],
    faq: [
      { q: 'How much tile waste should I allow?', a: 'Around 10% is a common starting point; use more for diagonal, herringbone, or complex cuts.' },
      { q: 'Does this include grout?', a: 'No. Grout depends on tile size, joint width, and depth and should be estimated separately.' },
    ],
    calculate: (v) => {
      const area = n(v.length) * n(v.width);
      const adjusted = waste(area, n(v.waste));
      const boxes = ceil(adjusted / Math.max(n(v.boxCoverage), 0.01));
      return [
        { label: 'Surface area', value: `${number(area, 1)} sq ft` },
        { label: 'Tile incl. waste', value: `${number(adjusted, 1)} sq ft` },
        { label: 'Boxes to buy', value: `${boxes}`, emphasis: true },
        { label: 'Estimated tile cost', value: money(boxes * n(v.boxPrice)), emphasis: true },
      ];
    },
  },
  {
    slug: 'concrete-calculator',
    title: 'Concrete Calculator',
    shortTitle: 'Concrete',
    category: 'Outdoor',
    icon: '🧱',
    description: 'Estimate cubic yards of concrete and approximate ready-mix cost.',
    intro: 'Calculate slab concrete by length, width, thickness, waste allowance, and your local price per cubic yard.',
    fields: [
      { key: 'length', label: 'Slab length', type: 'number', defaultValue: 20, min: 0.1, step: 0.5, unit: 'ft' },
      { key: 'width', label: 'Slab width', type: 'number', defaultValue: 10, min: 0.1, step: 0.5, unit: 'ft' },
      { key: 'thickness', label: 'Thickness', type: 'number', defaultValue: 4, min: 1, step: 0.5, unit: 'in' },
      { key: 'waste', label: 'Extra allowance', type: 'number', defaultValue: 10, min: 0, max: 25, step: 1, unit: '%' },
      { key: 'price', label: 'Ready-mix price', type: 'number', defaultValue: 165, min: 0, step: 5, unit: '$/yd³' },
    ],
    assumptions: ['Simple rectangular slab', '1 cubic yard = 27 cubic feet', 'Delivery minimums, short-load fees, reinforcement, pump, and labor excluded'],
    tips: ['Measure thickness carefully; small changes have a large effect.', 'Ask the supplier about minimum load and delivery fees.', 'For structural work, use engineered specifications rather than a planning calculator.'],
    faq: [
      { q: 'How many cubic feet are in a cubic yard?', a: 'There are 27 cubic feet in one cubic yard.' },
      { q: 'Why add extra concrete?', a: 'Subgrade irregularities, form variation, and spillage can increase the actual volume needed.' },
    ],
    calculate: (v) => {
      const cubicFeet = n(v.length) * n(v.width) * (n(v.thickness) / 12);
      const yards = cubicFeet / 27;
      const adjusted = waste(yards, n(v.waste));
      return [
        { label: 'Net concrete volume', value: `${number(yards, 2)} yd³` },
        { label: 'Order volume incl. extra', value: `${number(adjusted, 2)} yd³`, emphasis: true },
        { label: 'Approx. 60-lb bags', value: `${ceil((cubicFeet * (1 + n(v.waste) / 100)) / 0.45)} bags` },
        { label: 'Estimated ready-mix cost', value: money(adjusted * n(v.price)), emphasis: true },
      ];
    },
  },
  {
    slug: 'gravel-calculator',
    title: 'Gravel Calculator',
    shortTitle: 'Gravel',
    category: 'Outdoor',
    icon: '⛰️',
    description: 'Estimate gravel volume, tons, and material cost for driveways and landscape areas.',
    intro: 'Enter surface dimensions, depth, material density, and price per ton to plan a gravel order.',
    fields: [
      { key: 'length', label: 'Area length', type: 'number', defaultValue: 40, min: 0.1, step: 1, unit: 'ft' },
      { key: 'width', label: 'Area width', type: 'number', defaultValue: 10, min: 0.1, step: 1, unit: 'ft' },
      { key: 'depth', label: 'Depth', type: 'number', defaultValue: 3, min: 0.5, step: 0.5, unit: 'in' },
      { key: 'density', label: 'Material density', type: 'number', defaultValue: 1.4, min: 0.5, step: 0.05, unit: 'tons/yd³' },
      { key: 'waste', label: 'Extra allowance', type: 'number', defaultValue: 8, min: 0, max: 25, step: 1, unit: '%' },
      { key: 'price', label: 'Price per ton', type: 'number', defaultValue: 55, min: 0, step: 1, unit: '$' },
    ],
    assumptions: ['Uniform depth', 'Bulk density varies by stone type and moisture', 'Delivery and grading labor excluded'],
    tips: ['Ask your supplier for the actual tons-per-yard density.', 'Driveways often require multiple compacted layers.', 'Order depth should reflect compaction and sub-base requirements.'],
    faq: [
      { q: 'Why does gravel density matter?', a: 'Suppliers often sell by ton while project volume is measured in cubic yards, so density converts between volume and weight.' },
      { q: 'Does this include compaction?', a: 'The extra allowance helps, but final compacted depth depends on material and equipment.' },
    ],
    calculate: (v) => {
      const cubicFeet = n(v.length) * n(v.width) * (n(v.depth) / 12);
      const yards = cubicFeet / 27;
      const adjustedYards = waste(yards, n(v.waste));
      const tons = adjustedYards * n(v.density);
      return [
        { label: 'Net volume', value: `${number(yards, 2)} yd³` },
        { label: 'Order volume incl. extra', value: `${number(adjustedYards, 2)} yd³` },
        { label: 'Estimated weight', value: `${number(tons, 2)} tons`, emphasis: true },
        { label: 'Estimated material cost', value: money(tons * n(v.price)), emphasis: true },
      ];
    },
  },
  {
    slug: 'fence-calculator',
    title: 'Fence Calculator',
    shortTitle: 'Fence',
    category: 'Outdoor',
    icon: '🏡',
    description: 'Estimate fence panels, posts, gates, and basic material cost.',
    intro: 'Plan a straight-run or perimeter fence using total fence length, panel width, post spacing, gates, and editable unit prices.',
    fields: [
      { key: 'length', label: 'Total fence length', type: 'number', defaultValue: 120, min: 1, step: 1, unit: 'ft' },
      { key: 'panelWidth', label: 'Panel / section width', type: 'number', defaultValue: 8, min: 1, step: 0.5, unit: 'ft' },
      { key: 'postSpacing', label: 'Post spacing', type: 'number', defaultValue: 8, min: 2, step: 0.5, unit: 'ft' },
      { key: 'gates', label: 'Gates', type: 'number', defaultValue: 1, min: 0, step: 1 },
      { key: 'panelPrice', label: 'Price per panel', type: 'number', defaultValue: 95, min: 0, step: 1, unit: '$' },
      { key: 'postPrice', label: 'Price per post', type: 'number', defaultValue: 28, min: 0, step: 1, unit: '$' },
      { key: 'gatePrice', label: 'Price per gate', type: 'number', defaultValue: 180, min: 0, step: 1, unit: '$' },
      { key: 'waste', label: 'Extra allowance', type: 'number', defaultValue: 5, min: 0, max: 20, step: 1, unit: '%' },
    ],
    assumptions: ['Gate width is not deducted from total length', 'End/corner conditions can add posts', 'Concrete, rails, hardware, delivery, tax, and labor may be additional'],
    tips: ['Count corners and gate posts separately on the final plan.', 'Check property lines and local permit/setback rules before digging.', 'Call the local utility locating service before post-hole work.'],
    faq: [
      { q: 'How many fence posts do I need?', a: 'For a simple straight run, posts are roughly one more than the number of spaces. Corners, gates, and changes in direction can add posts.' },
      { q: 'Does this calculate labor?', a: 'No. It is a basic material-planning estimate using editable unit prices.' },
    ],
    calculate: (v) => {
      const panels = ceil((n(v.length) / Math.max(n(v.panelWidth), 0.1)) * (1 + n(v.waste) / 100));
      const posts = n(v.length) > 0 && n(v.postSpacing) > 0
            ? ceil(n(v.length) / n(v.postSpacing)) + 1 + n(v.gates) * 2
            : 0;
      const material = panels * n(v.panelPrice) + posts * n(v.postPrice) + n(v.gates) * n(v.gatePrice);
      return [
        { label: 'Fence panels / sections', value: `${panels}`, emphasis: true },
        { label: 'Estimated posts', value: `${posts}` },
        { label: 'Gates', value: `${n(v.gates)}` },
        { label: 'Estimated listed-material cost', value: money(material), emphasis: true },
      ];
    },
  },
  {
    slug: 'deck-calculator',
    title: 'Deck Calculator',
    shortTitle: 'Deck',
    category: 'Outdoor',
    icon: '🪚',
    description: 'Estimate deck surface area, decking lineal feet, waste, and budget.',
    intro: 'Use deck dimensions, board width, waste, and an editable material cost per square foot for an early planning estimate.',
    fields: [
      { key: 'length', label: 'Deck length', type: 'number', defaultValue: 16, min: 1, step: 0.5, unit: 'ft' },
      { key: 'width', label: 'Deck width', type: 'number', defaultValue: 12, min: 1, step: 0.5, unit: 'ft' },
      { key: 'boardWidth', label: 'Actual board width', type: 'number', defaultValue: 5.5, min: 1, step: 0.25, unit: 'in' },
      { key: 'gap', label: 'Board gap', type: 'number', defaultValue: 0.125, min: 0, step: 0.0625, unit: 'in' },
      { key: 'waste', label: 'Waste allowance', type: 'number', defaultValue: 10, min: 0, max: 25, step: 1, unit: '%' },
      { key: 'priceSqFt', label: 'Decking material price', type: 'number', defaultValue: 7.5, min: 0, step: 0.25, unit: '$/sq ft' },
    ],
    assumptions: ['Decking surface only', 'Framing, footings, railing, stairs, fasteners, permits, tax, and labor excluded'],
    tips: ['Confirm actual board dimensions, not nominal dimensions.', 'Complex patterns increase waste.', 'Structural framing should follow local code and span tables.'],
    faq: [
      { q: 'Does this include joists and posts?', a: 'No. The calculator focuses on surface decking and an editable square-foot material budget.' },
      { q: 'What waste factor should I use?', a: 'About 10% is a practical starting point for simple layouts; use more for picture-frame borders or diagonal patterns.' },
    ],
    calculate: (v) => {
      const area = n(v.length) * n(v.width);
      const adjusted = waste(area, n(v.waste));
      const effectiveBoardFt = (n(v.boardWidth) + n(v.gap)) / 12;
      const lineal = adjusted / Math.max(effectiveBoardFt, 0.01);
      return [
        { label: 'Deck surface area', value: `${number(area, 1)} sq ft` },
        { label: 'Decking area incl. waste', value: `${number(adjusted, 1)} sq ft` },
        { label: 'Approx. decking lineal feet', value: `${number(lineal, 0)} ft`, emphasis: true },
        { label: 'Estimated decking cost', value: money(adjusted * n(v.priceSqFt)), emphasis: true },
      ];
    },
  },
  {
    slug: 'roofing-calculator',
    title: 'Roofing Calculator',
    shortTitle: 'Roofing',
    category: 'Exterior',
    icon: '🏠',
    description: 'Estimate roof area, roofing squares, shingle bundles, waste, and material cost.',
    intro: 'Enter the roof footprint and pitch factor to estimate roofing squares and shingle bundles. Use measured roof planes for a more precise result.',
    fields: [
      { key: 'length', label: 'Building length', type: 'number', defaultValue: 50, min: 1, step: 1, unit: 'ft' },
      { key: 'width', label: 'Building width', type: 'number', defaultValue: 30, min: 1, step: 1, unit: 'ft' },
      { key: 'pitchFactor', label: 'Pitch multiplier', type: 'select', defaultValue: '1.118', options: [
        { label: 'Flat / very low — 1.00', value: '1' },
        { label: '4:12 — 1.055', value: '1.055' },
        { label: '6:12 — 1.118', value: '1.118' },
        { label: '8:12 — 1.202', value: '1.202' },
        { label: '10:12 — 1.302', value: '1.302' },
        { label: '12:12 — 1.414', value: '1.414' },
      ] },
      { key: 'waste', label: 'Waste allowance', type: 'number', defaultValue: 12, min: 0, max: 30, step: 1, unit: '%' },
      { key: 'bundlesPerSquare', label: 'Bundles per square', type: 'number', defaultValue: 3, min: 1, step: 1 },
      { key: 'bundlePrice', label: 'Price per bundle', type: 'number', defaultValue: 42, min: 0, step: 1, unit: '$' },
    ],
    assumptions: ['Simple roof footprint', 'Pitch multiplier approximates slope area', 'Underlayment, flashing, ridge cap, nails, tear-off, disposal, delivery, tax, and labor excluded'],
    tips: ['Hip roofs, valleys, dormers, and cut-up roofs need more waste.', 'A roofing square equals 100 sq ft.', 'Roof work is hazardous; use qualified professionals where appropriate.'],
    faq: [
      { q: 'What is a roofing square?', a: 'One roofing square is 100 square feet of roof surface.' },
      { q: 'How many bundles are in a square?', a: 'Three bundles is common for many asphalt shingles, but some products require more. Use the product label.' },
    ],
    calculate: (v) => {
      const footprint = n(v.length) * n(v.width);
      const roofArea = footprint * n(v.pitchFactor);
      const adjusted = waste(roofArea, n(v.waste));
      const squares = adjusted / 100;
      const bundles = ceil(squares * n(v.bundlesPerSquare));
      return [
        { label: 'Estimated roof surface', value: `${number(roofArea, 0)} sq ft` },
        { label: 'Area incl. waste', value: `${number(adjusted, 0)} sq ft` },
        { label: 'Roofing squares', value: `${number(squares, 2)}` },
        { label: 'Bundles to buy', value: `${bundles}`, emphasis: true },
        { label: 'Estimated shingle cost', value: money(bundles * n(v.bundlePrice)), emphasis: true },
      ];
    },
  },
  {
    slug: 'moving-cost-calculator',
    title: 'Moving Cost Calculator',
    shortTitle: 'Moving',
    category: 'Planning',
    icon: '🚚',
    description: 'Build a transparent moving budget from crew hours, truck, mileage, packing, and extras.',
    intro: 'Instead of pretending there is one universal moving price, this calculator lets you enter a mover quote structure and see the full budget.',
    fields: [
      { key: 'crewHours', label: 'Crew hours', type: 'number', defaultValue: 6, min: 0, step: 0.5, unit: 'hr' },
      { key: 'crewRate', label: 'Crew hourly rate', type: 'number', defaultValue: 165, min: 0, step: 5, unit: '$/hr' },
      { key: 'miles', label: 'Billable distance', type: 'number', defaultValue: 25, min: 0, step: 1, unit: 'mi' },
      { key: 'mileRate', label: 'Mileage rate', type: 'number', defaultValue: 2.5, min: 0, step: 0.1, unit: '$/mi' },
      { key: 'truckFee', label: 'Truck / travel fee', type: 'number', defaultValue: 125, min: 0, step: 5, unit: '$' },
      { key: 'packing', label: 'Packing materials/services', type: 'number', defaultValue: 150, min: 0, step: 10, unit: '$' },
      { key: 'extras', label: 'Other quoted extras', type: 'number', defaultValue: 75, min: 0, step: 5, unit: '$' },
      { key: 'contingency', label: 'Contingency', type: 'number', defaultValue: 10, min: 0, max: 30, step: 1, unit: '%' },
    ],
    assumptions: ['Inputs should come from actual mover pricing where possible', 'Insurance/valuation, tips, storage, specialty items, tolls, and tax may be separate'],
    tips: ['Get written estimates from multiple movers.', 'Ask which charges are hourly, fixed, distance-based, or minimums.', 'Check licensing/insurance requirements applicable to your move.'],
    faq: [
      { q: 'Is this a quote?', a: 'No. It is a budgeting tool that helps you combine the line items from a mover estimate.' },
      { q: 'Why use editable rates?', a: 'Moving prices vary widely by location, access, season, distance, and service level, so your local quote is more useful than a generic average.' },
    ],
    calculate: (v) => {
      const subtotal = n(v.crewHours) * n(v.crewRate) + n(v.miles) * n(v.mileRate) + n(v.truckFee) + n(v.packing) + n(v.extras);
      const total = waste(subtotal, n(v.contingency));
      return [
        { label: 'Labor', value: money(n(v.crewHours) * n(v.crewRate)) },
        { label: 'Mileage', value: money(n(v.miles) * n(v.mileRate)) },
        { label: 'Base budget before contingency', value: money(subtotal) },
        { label: 'Planning budget', value: money(total), emphasis: true },
      ];
    },
  },
  {
    slug: 'electricity-cost-calculator',
    title: 'Electricity Cost Calculator',
    shortTitle: 'Electricity',
    category: 'Energy',
    icon: '⚡',
    description: 'Estimate appliance electricity use and monthly operating cost.',
    intro: 'Enter wattage, daily runtime, days per month, and your utility rate to estimate energy use and cost.',
    fields: [
      { key: 'watts', label: 'Appliance power', type: 'number', defaultValue: 1500, min: 0, step: 10, unit: 'W' },
      { key: 'hours', label: 'Hours used per day', type: 'number', defaultValue: 4, min: 0, max: 24, step: 0.25, unit: 'hr' },
      { key: 'days', label: 'Days used per month', type: 'number', defaultValue: 30, min: 0, max: 31, step: 1 },
      { key: 'rate', label: 'Electricity rate', type: 'number', defaultValue: 0.18, min: 0, step: 0.01, unit: '$/kWh' },
    ],
    assumptions: ['Constant wattage while operating', 'Taxes, tiered rates, demand charges, and standby consumption excluded'],
    tips: ['Use measured watts from an energy monitor for the best estimate.', 'For cycling appliances such as AC units, use average operating power or duty cycle.', 'Your utility bill lists the actual energy rate and fees.'],
    faq: [
      { q: 'How do I convert watts to kilowatt-hours?', a: 'Multiply watts by hours of use, then divide by 1,000 to get kilowatt-hours.' },
      { q: 'Can I use this for an air conditioner?', a: 'Yes for planning, but AC units cycle and their actual consumption changes with weather, thermostat settings, and efficiency.' },
    ],
    calculate: (v) => {
      const dailyKwh = (n(v.watts) * n(v.hours)) / 1000;
      const monthlyKwh = dailyKwh * n(v.days);
      const monthlyCost = monthlyKwh * n(v.rate);
      return [
        { label: 'Daily energy use', value: `${number(dailyKwh, 2)} kWh` },
        { label: 'Monthly energy use', value: `${number(monthlyKwh, 1)} kWh`, emphasis: true },
        { label: 'Estimated monthly cost', value: money(monthlyCost), emphasis: true },
        { label: 'Estimated annual cost', value: money(monthlyCost * 12) },
      ];
    },
  },
  {
    slug: 'mulch-soil-calculator',
    title: 'Mulch & Soil Calculator',
    shortTitle: 'Mulch / Soil',
    category: 'Garden',
    icon: '🌱',
    description: 'Estimate cubic yards, bags, and material cost for mulch or soil.',
    intro: 'Calculate landscape material from area, depth, bag size, and local bag price.',
    fields: [
      { key: 'length', label: 'Area length', type: 'number', defaultValue: 30, min: 0.1, step: 0.5, unit: 'ft' },
      { key: 'width', label: 'Area width', type: 'number', defaultValue: 8, min: 0.1, step: 0.5, unit: 'ft' },
      { key: 'depth', label: 'Depth', type: 'number', defaultValue: 3, min: 0.5, step: 0.5, unit: 'in' },
      { key: 'bagSize', label: 'Bag size', type: 'number', defaultValue: 2, min: 0.25, step: 0.25, unit: 'cu ft' },
      { key: 'bagPrice', label: 'Price per bag', type: 'number', defaultValue: 4.98, min: 0, step: 0.01, unit: '$' },
      { key: 'waste', label: 'Extra allowance', type: 'number', defaultValue: 5, min: 0, max: 20, step: 1, unit: '%' },
    ],
    assumptions: ['Rectangular bed with uniform depth', 'Settling and compaction vary by material'],
    tips: ['Bulk delivery may be cheaper for larger volumes.', 'Avoid piling mulch against trunks or building siding.', 'Measure several beds separately and add them together.'],
    faq: [
      { q: 'How many cubic feet are in a cubic yard?', a: 'One cubic yard contains 27 cubic feet.' },
      { q: 'Should I buy bags or bulk?', a: 'Bags are convenient for small jobs; bulk material can be more economical for larger projects, depending on delivery fees.' },
    ],
    calculate: (v) => {
      const cubicFeet = n(v.length) * n(v.width) * (n(v.depth) / 12);
      const adjusted = waste(cubicFeet, n(v.waste));
      const yards = adjusted / 27;
      const bags = ceil(adjusted / Math.max(n(v.bagSize), 0.01));
      return [
        { label: 'Material volume', value: `${number(adjusted, 1)} cu ft` },
        { label: 'Cubic yards', value: `${number(yards, 2)} yd³`, emphasis: true },
        { label: 'Bags to buy', value: `${bags}`, emphasis: true },
        { label: 'Estimated bagged cost', value: money(bags * n(v.bagPrice)) },
      ];
    },
  },
  {
    slug: 'renovation-budget-calculator',
    title: 'Renovation Budget Calculator',
    shortTitle: 'Renovation Budget',
    category: 'Planning',
    icon: '📐',
    description: 'Build a renovation planning budget with contingency, design, and permits.',
    intro: 'Use your project area and a local cost-per-square-foot assumption, then add design, permit, and contingency allowances.',
    fields: [
      { key: 'area', label: 'Project area', type: 'number', defaultValue: 500, min: 1, step: 10, unit: 'sq ft' },
      { key: 'costSqFt', label: 'Construction allowance', type: 'number', defaultValue: 150, min: 0, step: 5, unit: '$/sq ft' },
      { key: 'designPct', label: 'Design / professional fees', type: 'number', defaultValue: 8, min: 0, max: 30, step: 1, unit: '%' },
      { key: 'permits', label: 'Permit allowance', type: 'number', defaultValue: 1500, min: 0, step: 100, unit: '$' },
      { key: 'contingency', label: 'Contingency', type: 'number', defaultValue: 15, min: 0, max: 40, step: 1, unit: '%' },
    ],
    assumptions: ['High-level planning only', 'Actual scope, location, finishes, existing conditions, labor market, and code requirements can materially change cost'],
    tips: ['Replace the default cost-per-square-foot with a local contractor estimate.', 'Older homes often justify a larger contingency.', 'Separate must-have scope from optional upgrades before requesting bids.'],
    faq: [
      { q: 'What contingency should I use?', a: 'Many planning budgets use roughly 10–20%, with higher allowances for older buildings, incomplete design, or unknown conditions.' },
      { q: 'Is cost per square foot accurate?', a: 'It is useful for early planning but not a substitute for a detailed scope, takeoff, and contractor bids.' },
    ],
    calculate: (v) => {
      const construction = n(v.area) * n(v.costSqFt);
      const design = construction * n(v.designPct) / 100;
      const subtotal = construction + design + n(v.permits);
      const contingency = subtotal * n(v.contingency) / 100;
      const total = subtotal + contingency;
      return [
        { label: 'Construction allowance', value: money(construction) },
        { label: 'Design / professional allowance', value: money(design) },
        { label: 'Permit allowance', value: money(n(v.permits)) },
        { label: 'Contingency', value: money(contingency) },
        { label: 'Planning budget', value: money(total), emphasis: true },
      ];
    },
  },
  {
    slug:'drywall-calculator', title:'Drywall Calculator',shortTitle:'Drywall',category:'Interior',icon:'🧰',
    description:'Estimate drywall sheets and material cost from wall area, openings and waste.',
    intro:'Use total wall length and wall height, subtract typical openings, then add cutting waste and round to whole sheets.',
    fields:[
      {key:'wallLength',label:'Total wall length',type:'number',defaultValue:0,min:0.1,step:0.5,unit:'ft'},
      {key:'wallHeight',label:'Wall height',type:'number',defaultValue:0,min:0.1,step:0.5,unit:'ft'},
      {key:'doors',label:'Doors',type:'number',defaultValue:0,min:0,step:1,help:'Subtracts 20 sq ft per door.'},
      {key:'windows',label:'Windows',type:'number',defaultValue:0,min:0,step:1,help:'Subtracts 15 sq ft per window.'},
      {key:'sheetArea',label:'Area per sheet',type:'number',defaultValue:0,min:0.1,step:0.5,unit:'sq ft'},
      {key:'waste',label:'Waste allowance',type:'number',defaultValue:0,min:0,max:50,step:1,unit:'%'},
      {key:'sheetPrice',label:'Price per sheet',type:'number',defaultValue:0,min:0,step:1,unit:'$'},
    ],
    assumptions:['Flat rectangular walls','20 sq ft removed per door; 15 sq ft per window','Joint compound, tape, screws, labor and tax excluded'],
    tips:['A standard 4 × 8 ft drywall sheet covers 32 sq ft.','Use sheets sized for your ceiling and framing layout.','Consult a qualified specialist for fire-rated or moisture-resistant assemblies.'],
    faq:[{q:'How large is one standard drywall sheet?',a:'A typical 4 × 8 foot sheet covers 32 square feet, although other sizes are sold.'},{q:'Does this include joint compound?',a:'No. It covers drywall sheets and their material cost only.'}],
    calculate:(v)=>{const area=Math.max(0,n(v.wallLength)*n(v.wallHeight)-20*n(v.doors)-15*n(v.windows));const needed=waste(area,n(v.waste));const sheets=n(v.sheetArea)>0?ceil(needed/n(v.sheetArea)):0;
      return [{label:'Net drywall area',value:`${number(area,1)} sq ft`},{label:'Area incl. waste',value:`${number(needed,1)} sq ft`},{label:'Sheets to buy',value:String(sheets),emphasis:true},{label:'Estimated drywall cost',value:money(sheets*n(v.sheetPrice)),emphasis:true}];}
  },
  {
    slug:'wallpaper-calculator',title:'Wallpaper Calculator',shortTitle:'Wallpaper',category:'Interior',icon:'🧻',
    description:'Estimate wallpaper rolls and cost from wall area and roll coverage.',
    intro:'Enter combined wallpaper wall length and height, subtract doors/windows and specify usable roll coverage.',
    fields:[
      {key:'wallLength',label:'Total wall length',type:'number',defaultValue:0,min:0.1,step:0.5,unit:'ft'},
      {key:'height',label:'Wall height',type:'number',defaultValue:0,min:0.1,step:0.5,unit:'ft'},
      {key:'doors',label:'Doors',type:'number',defaultValue:0,min:0,step:1},
      {key:'windows',label:'Windows',type:'number',defaultValue:0,min:0,step:1},
      {key:'coverage',label:'Usable coverage per roll',type:'number',defaultValue:0,min:0.1,step:0.5,unit:'sq ft'},
      {key:'waste',label:'Pattern-match extra',type:'number',defaultValue:0,min:0,max:60,step:1,unit:'%'},
      {key:'price',label:'Price per roll',type:'number',defaultValue:0,min:0,step:1,unit:'$'},
    ],
    assumptions:['20 sq ft per door and 15 sq ft per window','Usable coverage, not printed package area','Paste, tools, trim and installation excluded'],
    tips:['Pattern repeat affects usable coverage per roll.','Verify the manufacturer roll size and repeat before purchasing.','Purchase rolls from one dye lot.'],
    faq:[{q:'What is usable roll coverage?',a:'It is the practical area after allowing for pattern repeats and cuts.'},{q:'Why add a pattern-match allowance?',a:'Large patterns can require additional length per strip.'}],
    calculate:(v)=>{const area=Math.max(0,n(v.wallLength)*n(v.height)-20*n(v.doors)-15*n(v.windows));const adjusted=waste(area,n(v.waste));const rolls=n(v.coverage)>0?ceil(adjusted/n(v.coverage)):0;
      return [{label:'Wall coverage',value:`${number(area,1)} sq ft`},{label:'Coverage incl. waste',value:`${number(adjusted,1)} sq ft`},{label:'Rolls to buy',value:String(rolls),emphasis:true},{label:'Estimated wallpaper cost',value:money(rolls*n(v.price)),emphasis:true}];}
  },
  {
    slug:'paver-calculator',title:'Patio Paver Calculator',shortTitle:'Pavers',category:'Outdoor',icon:'🧱',
    description:'Estimate individual patio pavers, base area, cuts and paver material cost.',
    intro:'Calculate how many rectangular paving stones cover a patio when you know stone dimensions and waste allowance.',
    fields:[
      {key:'length',label:'Patio length',type:'number',defaultValue:0,min:0.1,step:0.5,unit:'ft'},
      {key:'width',label:'Patio width',type:'number',defaultValue:0,min:0.1,step:0.5,unit:'ft'},
      {key:'paverLength',label:'Paver length',type:'number',defaultValue:0,min:0.1,step:0.5,unit:'in'},
      {key:'paverWidth',label:'Paver width',type:'number',defaultValue:0,min:0.1,step:0.5,unit:'in'},
      {key:'waste',label:'Cutting allowance',type:'number',defaultValue:0,min:0,max:40,step:1,unit:'%'},
      {key:'price',label:'Price per paver',type:'number',defaultValue:0,min:0,step:0.01,unit:'$'},
    ],
    assumptions:['Rectangular patio and rectangular pavers','No allowance for joint spacing','Base gravel, sand, edge restraint, labor and tax excluded'],
    tips:['Confirm actual paver sizes, not nominal sizes.','Complex patterns usually increase cutting waste.','Use local requirements for drainage and base preparation.'],
    faq:[{q:'How is the paver count calculated?',a:'Patio square feet are divided by each paver’s square feet and rounded up after adding waste.'},{q:'Does this include base gravel?',a:'No; use the gravel calculator separately.'}],
    calculate:(v)=>{const area=n(v.length)*n(v.width);const paverArea=(n(v.paverLength)*n(v.paverWidth))/144;const count=paverArea>0?ceil(waste(area,n(v.waste))/paverArea):0;
      return [{label:'Patio area',value:`${number(area,1)} sq ft`},{label:'Area per paver',value:`${number(paverArea,3)} sq ft`},{label:'Pavers to buy',value:String(count),emphasis:true},{label:'Estimated paver cost',value:money(count*n(v.price)),emphasis:true}];}
  },

];

// Set the initial value of every numeric calculator field to 0
for (const calculator of calculators) {
  for (const field of calculator.fields) {
    if (field.type === 'number') {
      field.defaultValue = 0;
    }
  }
}





export const calculatorBySlug = (slug: string) => calculators.find((c) => c.slug === slug);




