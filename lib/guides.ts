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
      {
        heading: "A worked renovation budget",
        paragraphs: [
          "A simple planning scenario shows why a single construction cost can be misleading. A 500-square-foot renovation at an illustrative $150 per square foot starts with a $75,000 construction allowance. Add 8% for design and related professional fees ($6,000), plus $1,500 for permits, bringing the initial subtotal to $82,500.",
          "A 15% contingency on that subtotal adds $12,375, for a planning budget of $94,875. These numbers are examples, not current market prices. The point is to make every allowance visible so you can replace it with local quotes and decide what to cut or postpone.",
        ],
      },
      {
        heading: "Compare bids using the same scope",
        paragraphs: [
          "Ask every contractor to price the same drawings, material specifications, site access conditions and schedule. Otherwise the lowest total may reflect excluded tasks rather than genuine savings. Check whether each quote includes delivery, waste disposal, permits, tax and finishing.",
          "Look for assumptions that shift risk to the owner: uncertain quantities, allowances for fixtures, hidden damage and change-order rates. A clear comparison table is more informative than a single headline price.",
        ],
        bullets: [
          "Record the scope and exclusions for each bid.",
          "Separate material, labor, equipment, permit and tax allowances.",
          "Replace guessed quantities with measurements.",
          "Keep contingency separate from optional upgrades.",
        ],
      },
      {
        heading: "Revise the estimate as decisions improve",
        paragraphs: [
          "An early budget is a working model. After you receive material prices or a contractor takeoff, update the corresponding line items instead of applying one blanket percentage to the entire project. Save a dated copy so you can understand why the estimate moved.",
          "Use the linked renovation budget calculator to test how design fees, permits and contingency affect the total. Verify all final numbers with people responsible for the actual work.",
        ],
      },
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
      {
        heading: "Example: two coats in a rectangular room",
        paragraphs: [
          "Consider a room that is 14 feet long, 12 feet wide and 8 feet high. The perimeter is 2 × (14 + 12) = 52 feet, so the gross wall area is 52 × 8 = 416 square feet. If there is one 20-square-foot door and two 15-square-foot windows, subtract 50 square feet of openings to obtain 366 square feet of paintable wall.",
          "For two coats, the total coverage requirement becomes 366 × 2 = 732 square feet. With 10% extra, plan for 805.2 square feet of coverage. At an illustrative 350 square feet per gallon, that is about 2.30 gallons, rounded to 3 whole gallons for purchasing.",
        ],
      },
      {
        heading: "Choose a sensible allowance",
        paragraphs: [
          "Waste is affected by roller and tray losses, surface texture, overspray, spills and touch-ups. It is not a substitute for counting additional coats. If you need a primer or a special bonding coat, calculate that product separately using its own label coverage.",
          "Painting dark over light or light over dark can require a different number of coats than a simple refresh. Small patches and difficult corners may also change how much product you actually use.",
        ],
        bullets: [
          "Measure ceilings and trim separately if you intend to paint them.",
          "Check the manufacturer coverage and recommended coat count.",
          "Record doors and windows or measure unusually large openings.",
          "Confirm can sizes and prices at your local supplier.",
        ],
      },
      {
        heading: "Before buying",
        paragraphs: [
          "Take the estimated gallons to the store together with the paint specification. Ask whether different bases, sheens or colors affect the recommended coating system. Purchase compatible product batches where feasible and follow the label instructions for preparation, drying and ventilation.",
        ],
      },
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
      {
        heading: "Example: full boxes, not just square feet",
        paragraphs: [
          "For a 16-foot by 12-foot room, the base area is 16 × 12 = 192 square feet. Allow 10% for cuts and waste: 192 × 1.10 = 211.2 square feet. If each box covers 22.5 square feet, the order is 211.2 ÷ 22.5 ≈ 9.39 boxes.",
          "Because flooring is sold in whole boxes, round the number up to 10. Those boxes provide 225 square feet of purchased coverage. At an illustrative $58 per box, the material estimate is $580 before taxes, trims, underlayment or installation.",
        ],
      },
      {
        heading: "Layout can change the order",
        paragraphs: [
          "Every doorway, narrow passage, alcove and transition creates cuts. For plank products, the direction of laying and how offcuts can be reused matter. Diagonal layouts and herringbone patterns generally need a more cautious waste estimate than a basic straight run.",
          "When flooring continues through multiple rooms, draw a simple plan and consider expansion gaps and transitions rather than adding areas blindly. Manufacturer installation rules may affect the direction and allowed span.",
        ],
        bullets: [
          "Measure each rectangular area and add them together.",
          "Check the actual square feet per carton.",
          "Choose waste based on pattern and room shape.",
          "Include underlayment, trims, adhesives and delivery separately.",
        ],
      },
      {
        heading: "Check the order before payment",
        paragraphs: [
          "Confirm that the boxes share compatible batch, color and product information. Keep records of the selected flooring and the amount purchased. An unopened spare carton may be valuable if the material is discontinued, but confirm the retailer return policy before buying excess stock.",
        ],
      },
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
      {
        heading: "Example: converting a small slab",
        paragraphs: [
          "For a 20-foot by 10-foot slab that is 4 inches thick, convert thickness to feet: 4 ÷ 12 = 0.3333 foot. Volume is 20 × 10 × (4 ÷ 12) ≈ 66.67 cubic feet. Divide by 27 cubic feet per cubic yard to get about 2.47 cubic yards.",
          "Adding an illustrative 10% allowance gives approximately 2.72 cubic yards. At an example price of $165 per cubic yard, the ready-mix material estimate is about $448.15 before supplier fees. Ask the supplier how they round orders and whether a short-load charge applies.",
        ],
      },
      {
        heading: "Thickness and site conditions matter",
        paragraphs: [
          "Thickness is a particularly sensitive input: increasing it from 4 to 5 inches raises volume by 25% for the same length and width. Excavation depth, levelness of the subgrade and formwork can also affect actual volume.",
          "The calculator estimates quantities but cannot specify compressive strength, reinforcement, joints or foundation details. Those choices must reflect intended loads, ground conditions and applicable local requirements.",
        ],
        bullets: [
          "Confirm measurements in feet and thickness in inches.",
          "Check slab thickness and strength specifications with a qualified person.",
          "Ask suppliers about delivery windows, minimum orders and pump charges.",
          "Have an appropriate placing and curing plan before ordering.",
        ],
      },
      {
        heading: "A note about ready-mix versus bags",
        paragraphs: [
          "Small repairs may be economical using bags, whereas larger pours may justify ready-mix delivery. Compare not just nominal material cost but also labor, mixing capacity, consistency, waste, delivery and the workable placing time. Use manufacturer bag-yield information rather than assuming all mixes are identical.",
        ],
      },
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
      {
        heading: "Example: pitch, squares and bundles",
        paragraphs: [
          "Suppose a simple building footprint measures 50 feet by 30 feet: 1,500 square feet. For an illustrative 6:12 pitch, use an approximate multiplier of 1.118, giving 1,677 square feet of sloped roof area. Add 12% waste to reach about 1,878 square feet.",
          "Divide by 100 to obtain approximately 18.78 roofing squares. At an illustrative three bundles per square, this is 56.35 bundles, rounded up to 57. At an example $42 per bundle, the shingle-only cost is $2,394. Complex roofs need a roof-plane takeoff, not just a footprint estimate.",
        ],
      },
      {
        heading: "What the shingle estimate excludes",
        paragraphs: [
          "Shingles are only part of a roof system. Starter strips, ridge and hip caps, underlayment, flashing, ventilation, fasteners, drip edge, ice or water barriers, and damaged decking can affect the final order. Removal and disposal of an old roof also add cost and labor.",
          "The number of bundles required per square depends on the specific shingle product. Use the manufacturer coverage and installation guidance rather than a universal rule.",
        ],
        bullets: [
          "Measure or obtain plans for each roof plane where possible.",
          "Confirm the pitch and product-specific bundles per square.",
          "Add separate items for flashing, ridge cap, underlayment and accessories.",
          "Use a qualified roofer for hazardous measurements and installation.",
        ],
      },
      {
        heading: "Know when to stop estimating",
        paragraphs: [
          "For steep, high or complicated roofs, professional measurement is often safer and more accurate. This calculator is an early materials-planning aid, not an engineering, waterproofing or fall-protection design tool.",
        ],
      },
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
      {
        heading: "Worked example: hold contingency separately",
        paragraphs: [
          "Imagine a renovation estimate with $75,000 in construction allowance, $6,000 in design fees and $1,500 in permits. The subtotal is $82,500. A 15% contingency equals $12,375, bringing the planning budget to $94,875.",
          "Now assume an unexpected plumbing repair is priced at $3,000. That may be charged against the contingency, leaving $9,375 available for further unforeseen work. A decorative upgrade selected by choice is not the same kind of event and should not quietly consume this reserve.",
        ],
      },
      {
        heading: "Choose the reserve using actual uncertainty",
        paragraphs: [
          "An older building with concealed damage, unclear scope and limited survey information carries different uncertainty from a simple surface refresh. Do not choose a percentage solely because someone else used it. List the specific risks and decide whether the reserve is sufficient for the possible size and likelihood of those risks.",
          "A large contingency is not a replacement for investigating known problems. Resolve accessible unknowns through inspections, plans, quotes and relevant professional input before committing to construction.",
        ],
        bullets: [
          "Identify risks: concealed services, drainage, structure, permits and product lead times.",
          "Track contingency separately from finish upgrades.",
          "Record approved changes and the reason for each change.",
          "Revise the remaining contingency after actual costs are known.",
        ],
      },
      {
        heading: "Build a useful decision record",
        paragraphs: [
          "Keep dated versions of the budget with supplier quotations and notes about assumptions. When a cost changes, identify whether it is due to more work, a higher unit price or a different material. This is far more useful than watching one total change without explanation.",
        ],
      },
    ],
  },
];

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug);
