export const PRICING = {
  cleaning: { from: 130, to: 350, unit: 'studio to 4-bed' },
  pest: { from: 90, to: 500 },
  gardening: { firstHour: 70, additionalHour: 50 },
  removals: { fromPerHour: 80, toPerHour: 160 },
};

export const OVERALL_STARTING_PRICE = Math.min(
  PRICING.cleaning.from,
  PRICING.pest.from,
  PRICING.gardening.firstHour,
  PRICING.removals.fromPerHour
);
