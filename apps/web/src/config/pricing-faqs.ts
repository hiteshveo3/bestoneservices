// Single source of truth for the /prices/ FAQ content — used by both the page
// (FaqAccordion) and pricing-schema.ts (FAQPage structured data), so the two
// never drift apart.
export const PRICING_FAQS: Array<{ q: string; a: string }> = [
  {
    q: "How are End of Tenancy cleaning prices calculated?",
    a: "End of Tenancy cleaning is calculated on a fixed flat-rate basis according to property size (e.g., Studio £130, 1 Bed £200, 2 Bed £230, 3 Bed £300, 4 Bed £350). All packages include our 48-Hour Re-Clean Guarantee.",
  },
  {
    q: "What is included in Pest Control visit packages?",
    a: "Pest control packages are calculated by property size and infestation level. Single visit treatments start at £90–£120; 2-visit packages (£160–£190) include a 1-month written guarantee; 3-visit packages (£210–£230) include a 3-month written guarantee.",
  },
  {
    q: "How does Gardening team pricing work?",
    a: "Gardening maintenance uses a 2-gardener team model charged at £70 for the first hour and £50 for each additional hour, with a £70 minimum charge. Waste removal is billed at £5 per standard bag or £50 per jumbo bag.",
  },
  {
    q: "What are the rates for Man & Van Removals?",
    a: "Removals start at £80–£120 per hour for 2 Men + 1 Luton Van (minimum £160/2 hours) or £120–£160 per hour for 3 Men + Large Van. Full packing is £30/hr standard or £25/hr for Best One Club members.",
  },
  {
    q: "Is the calculator price the final price?",
    a: "Yes, provided the details you enter match the property. We confirm the figure in writing before the visit, and if something on site genuinely differs from what was entered, we tell you the revised number before starting rather than after.",
  },
  {
    q: "Do your prices include VAT?",
    a: "Yes. Every figure on this page and in the calculator is the amount you pay — there is no separate charge added at checkout.",
  },
  {
    q: "What if the job takes longer than quoted?",
    a: "For fixed-price work like End of Tenancy cleaning, extra time is our problem, not your cost. For hourly work such as gardening and removals, we agree the expected hours up front and contact you before exceeding them.",
  },
  {
    q: "How does the 48-hour re-clean guarantee work?",
    a: "If your letting agent or landlord raises a cleaning issue within 48 hours of an End of Tenancy clean, we return and re-clean the areas concerned at no charge. It's stated on your booking confirmation, not just on this page.",
  },
  {
    q: "Why is your pest control priced differently from a typical London quote?",
    a: "Our rate reflects a published price list rather than a per-visit assessment. We do the same treatment work with the same warranties — there's no survey fee layered on top and no upward adjustment on the day.",
  },
  {
    q: "Do you charge extra for congestion zone or parking?",
    a: "Not within our stated coverage area. If a job falls outside it, we tell you the travel cost before booking rather than adding it to the invoice.",
  },
];
