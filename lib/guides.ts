export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  updated: string;
  calculatorSlug?: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

export const guides: Guide[] = [
  {
    slug: 'how-to-estimate-home-project-costs',
    title: 'How to Estimate a Home Project Without Fooling Yourself',
    excerpt: 'A practical framework for quantities, local prices, labor, waste, contingency, tax, and quote comparison.',
    category: 'Planning', readTime: '7 min', updated: 'October 2026', calculatorSlug: 'renovation-budget-calculator',
    sections: [
      { heading: 'Start with scope, not a price', paragraphs: ['Write down exactly what is included and excluded before comparing numbers. A cheap estimate can simply contain less work.'], bullets: ['Project dimensions and quantities', 'Demolition and disposal', 'Materials and finish level', 'Labor and access conditions', 'Permits, design, delivery, and tax'] },
      { heading: 'Use local unit prices', paragraphs: ['National averages are useful for orientation, but your best planning input is a current local quote or store price. Our calculators therefore keep price fields editable.'] },
      { heading: 'Add waste deliberately', paragraphs: ['Waste is not the same for every material. Straight flooring can need less waste than patterned tile; a cut-up roof can need more than a simple gable. Use a factor that matches the project.'] },
      { heading: 'Protect the budget with contingency', paragraphs: ['Contingency is for unknowns, not optional upgrades. Early-stage renovations and older buildings usually deserve more room for surprises.'] },
    ],
  },
  {
    slug: 'paint-quantity-planning-guide',
    title: 'Paint Quantity Planning Guide: Walls, Coats, Coverage & Waste',
    excerpt: 'Understand the measurements behind a paint estimate so you can adjust the calculator confidently.',
    category: 'Interior', readTime: '5 min', updated: 'October 2026', calculatorSlug: 'paint-calculator',
    sections: [
      { heading: 'Measure wall area', paragraphs: ['For a rectangular room, wall area starts with room perimeter multiplied by wall height. Subtract large openings if you want a tighter estimate.'] },
      { heading: 'Multiply by coats', paragraphs: ['Coverage is normally stated per coat. Two coats effectively double the surface area the paint must cover. Primer is a separate product unless your specific coating system says otherwise.'] },
      { heading: 'Use the can label', paragraphs: ['Paint coverage varies with product, surface porosity, texture, application method, and color change. The manufacturer label is more useful than a generic default.'] },
      { heading: 'Round up for shopping', paragraphs: ['Paint is sold in container sizes. A small remainder is often useful for touch-ups, so the calculator rounds the final gallon purchase upward.'] },
    ],
  },
  {
    slug: 'flooring-waste-and-boxes-guide',
    title: 'Flooring Waste & Box Planning Guide',
    excerpt: 'Learn how layout, cuts, box coverage, and spare material affect a flooring order.',
    category: 'Interior', readTime: '5 min', updated: 'October 2026', calculatorSlug: 'flooring-calculator',
    sections: [
      { heading: 'Measure net floor area', paragraphs: ['Split irregular spaces into simple rectangles, calculate each area, then add them together.'] },
      { heading: 'Choose a waste factor', paragraphs: ['Straight runs in simple rooms often require less waste than diagonal layouts, herringbone patterns, narrow hallways, and spaces with many corners.'] },
      { heading: 'Convert area to full boxes', paragraphs: ['Manufacturers list square feet per carton. Divide adjusted project area by that coverage and round up to a whole box.'] },
      { heading: 'Keep repair stock', paragraphs: ['Keeping compatible spare material can be valuable because exact colors and product lines may be discontinued later.'] },
    ],
  },
  {
    slug: 'concrete-ordering-basics',
    title: 'Concrete Ordering Basics for Small Slabs',
    excerpt: 'Convert slab dimensions into cubic yards and understand what a volume calculator does not include.',
    category: 'Outdoor', readTime: '6 min', updated: 'October 2026', calculatorSlug: 'concrete-calculator',
    sections: [
      { heading: 'Volume first', paragraphs: ['Concrete volume equals length × width × thickness. Convert thickness from inches to feet before calculating cubic feet, then divide by 27 for cubic yards.'] },
      { heading: 'Why extra volume matters', paragraphs: ['Subgrade variations, forms, spillage, and imperfect measurements can increase actual consumption, so an allowance is common.'] },
      { heading: 'Supplier charges', paragraphs: ['Ready-mix suppliers may have minimum loads, delivery charges, short-load fees, waiting time, or pump charges. Add those from your supplier quote rather than assuming one national number.'] },
      { heading: 'Structure and safety', paragraphs: ['A quantity calculator does not determine slab thickness, reinforcement, footing design, frost protection, or code requirements. Structural decisions need appropriate local guidance.'] },
    ],
  },
  {
    slug: 'roofing-squares-and-waste',
    title: 'Roofing Squares, Bundles, Pitch & Waste Explained',
    excerpt: 'A homeowner-friendly explanation of roofing measurement and why complex roofs need careful takeoffs.',
    category: 'Exterior', readTime: '6 min', updated: 'October 2026', calculatorSlug: 'roofing-calculator',
    sections: [
      { heading: 'A square is 100 square feet', paragraphs: ['Roofing material is commonly planned in squares. Ten squares represent about 1,000 square feet of roof surface before waste.'] },
      { heading: 'Pitch increases surface area', paragraphs: ['A sloped roof has more surface area than the horizontal building footprint. A pitch multiplier provides a useful early estimate for simple roofs.'] },
      { heading: 'Complex roofs need more care', paragraphs: ['Valleys, hips, dormers, skylights, intersections, starter courses, and ridge caps can materially change material needs.'] },
      { heading: 'Safety matters', paragraphs: ['Roof measurement and installation can involve serious fall risk. Use safe measurement methods and qualified professionals when needed.'] },
    ],
  },
  {
    slug: 'renovation-contingency-guide',
    title: 'Renovation Contingency: What It Is and How to Use It',
    excerpt: 'Create a budget buffer for unknown conditions without confusing contingency with wish-list upgrades.',
    category: 'Planning', readTime: '5 min', updated: 'October 2026', calculatorSlug: 'renovation-budget-calculator',
    sections: [
      { heading: 'Contingency is for uncertainty', paragraphs: ['Hidden damage, incomplete design, access problems, and market changes can create unplanned cost. Contingency gives the project room to absorb some of that uncertainty.'] },
      { heading: 'Do not spend it at the start', paragraphs: ['Treat contingency as protected budget, not as money available for upgrades before the unknowns have been resolved.'] },
      { heading: 'Match the percentage to risk', paragraphs: ['A well-documented new project with few unknowns may need less contingency than a renovation involving concealed conditions in an older home.'] },
      { heading: 'Update as scope becomes clearer', paragraphs: ['As design, investigation, and contractor pricing improve, replace allowances with real numbers and reassess the remaining risk.'] },
    ],
  },
];

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug);
