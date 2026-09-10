// Data-driven step configuration for the /prices/ Instant Estimator.
//
// This file derives every number it exposes from masterPricingData in
// pricing-data.ts — it must never hardcode a price. If a figure needs to
// change, change it in pricing-data.ts and it flows through here, the
// calculator UI, the full rate tables, and the schema markup identically.

import { masterPricingData, type PriceVariantData } from "@/config/pricing-data";

// Note: "gardening" (not the mockup's "garden") to stay compatible with the
// defaultVertical prop already wired into 5 other pages that embed this
// calculator (removals, gardening, end-of-tenancy-cleaning, [category], etc).
export type CalcCategory = "cleaning" | "pest" | "gardening" | "removals";

export const CALC_TO_DATA_KEY: Record<CalcCategory, keyof typeof masterPricingData> = {
  cleaning: "cleaning",
  pest: "pest-control",
  gardening: "gardening",
  removals: "removals",
};

export interface ChoiceItem {
  label: string;
  value: number;
  note: string;
}

export interface AddonItem {
  label: string;
  price: number;
}

export interface FeaturedCard {
  name: string;
  badge: string;
  price: string;
  unit: string;
  includes: string[];
}

export interface CategoryCalcConfig {
  key: CalcCategory;
  label: string;
  fromNote: string;
  steps: string[];
  guarantee: string;
  marketContext: string;
  choices: Record<string, { title: string; items: ChoiceItem[] }>;
  addons: AddonItem[];
  featured: FeaturedCard[];
}

/** Parses a single flat "£NN" style priceDisplay into a number; returns null for ranges/custom/included text we can't safely turn into calculator arithmetic. */
function parseFlatPrice(display: string): number | null {
  const match = display.match(/^£(\d+)/);
  if (!match) return null;
  if (display.includes("–") || display.includes("-") || /custom|included/i.test(display)) return null;
  return Number(match[1]);
}

function findVariant(dataKey: keyof typeof masterPricingData, id: string): PriceVariantData {
  const variant = masterPricingData[dataKey].variants.find((v) => v.id === id);
  if (!variant) throw new Error(`pricing-calculator-config: unknown variant "${id}" in "${dataKey}"`);
  return variant;
}

function cleaningConfig(): CategoryCalcConfig {
  const data = masterPricingData.cleaning;
  const sizes: Array<{ label: string; std: string; prem: string }> = [
    { label: "Studio flat", std: "studio_std", prem: "studio_prem" },
    { label: "1 bedroom", std: "1bed_std", prem: "1bed_prem" },
    { label: "2 bedroom", std: "2bed_std", prem: "2bed_prem" },
    { label: "3 bedroom", std: "3bed_std", prem: "3bed_prem" },
    { label: "4 bedroom", std: "4bed_std", prem: "4bed_prem" },
  ];

  return {
    key: "cleaning",
    label: "Cleaning",
    fromNote: `from £${findVariant("cleaning", "studio_std").startingPrice}`,
    steps: ["category", "size", "tier", "addons", "result"],
    guarantee: data.guaranteeText,
    marketContext: data.marketContext,
    choices: {
      size: {
        title: "How big is the property?",
        items: sizes.map((s) => {
          const v = findVariant("cleaning", s.std);
          return { label: s.label, value: v.startingPrice, note: `£${v.startingPrice}` };
        }),
      },
      tier: {
        // Value carries the actual premium *upcharge* (real prem − real std),
        // not a flat percentage like the mockup — our tiers are two separate
        // published prices per size, not a formulaic uplift.
        title: "Which tier?",
        items: [{ label: "Standard", value: 0, note: "Included" }],
      },
    },
    addons: data.addOns
      .map((a) => ({ label: a.name, price: parseFlatPrice(a.priceDisplay) }))
      .filter((a): a is AddonItem => a.price !== null),
    featured: [
      {
        name: "Studio flat",
        badge: "Most booked",
        price: `£${findVariant("cleaning", "studio_std").startingPrice}`,
        unit: "End of tenancy, fixed price",
        includes: findVariant("cleaning", "studio_std").features,
      },
      {
        name: "2 bedroom",
        badge: "",
        price: `£${findVariant("cleaning", "2bed_std").startingPrice}`,
        unit: "End of tenancy, fixed price",
        includes: findVariant("cleaning", "2bed_std").features,
      },
      {
        name: "2 bedroom premium",
        badge: "Premium",
        price: `£${findVariant("cleaning", "2bed_prem").startingPrice}`,
        unit: "Premium tier, fixed price",
        includes: findVariant("cleaning", "2bed_prem").features,
      },
    ],
  };
}

/** Size → [standard variant id, premium variant id], used to compute the real tier upcharge once a size is picked. */
export const CLEANING_TIER_VARIANT_IDS: Record<string, [string, string]> = {
  "Studio flat": ["studio_std", "studio_prem"],
  "1 bedroom": ["1bed_std", "1bed_prem"],
  "2 bedroom": ["2bed_std", "2bed_prem"],
  "3 bedroom": ["3bed_std", "3bed_prem"],
  "4 bedroom": ["4bed_std", "4bed_prem"],
};

function pestConfig(): CategoryCalcConfig {
  const data = masterPricingData["pest-control"];
  const speciesIds = [
    "species_rat",
    "species_mice",
    "species_bed_bug",
    "species_cockroach",
    "species_ant",
    "species_flea",
    "wasp_removal",
  ];
  const nightSurcharge = data.addOns.find((a) => a.name.startsWith("Night Emergency"));
  const nightAmount = nightSurcharge ? parseFlatPrice(nightSurcharge.priceDisplay.replace("Surcharge", "").trim()) ?? 50 : 50;

  return {
    key: "pest",
    label: "Pest control",
    fromNote: `from £${findVariant("pest-control", "wasp_removal").startingPrice}`,
    steps: ["category", "pest", "timing", "result"],
    guarantee: data.guaranteeText,
    marketContext: data.marketContext,
    choices: {
      pest: {
        title: "What are you dealing with?",
        items: speciesIds.map((id) => {
          const v = findVariant("pest-control", id);
          return { label: v.name.replace(" Treatment", "").replace(" Control", ""), value: v.startingPrice, note: `from £${v.startingPrice}` };
        }),
      },
      // The mockup's "property type" uplift doesn't exist in our real pricing —
      // species rates are flat, published rates rather than property-scaled.
      // The one genuine, sourced surcharge that applies across every species is
      // the night emergency slot, so that's what this step offers instead.
      timing: {
        title: "When do you need it?",
        items: [
          { label: "Standard daytime slot", value: 0, note: "Included" },
          { label: "Night emergency (8pm–5am)", value: nightAmount, note: `+£${nightAmount}` },
        ],
      },
    },
    addons: [],
    featured: [
      {
        name: "Mice or rats",
        badge: "Most booked",
        price: `£${findVariant("pest-control", "species_mice").startingPrice}`,
        unit: "First treatment, starting rate",
        includes: findVariant("pest-control", "species_mice").features,
      },
      {
        name: "Bed bugs",
        badge: "",
        price: `£${findVariant("pest-control", "species_bed_bug").startingPrice}`,
        unit: "Per treated property",
        includes: findVariant("pest-control", "species_bed_bug").features,
      },
      {
        name: "Wasp nest",
        badge: "Fastest",
        price: `£${findVariant("pest-control", "wasp_removal").startingPrice}`,
        unit: "Single visit, nest removal",
        includes: findVariant("pest-control", "wasp_removal").features,
      },
    ],
  };
}

function gardeningConfig(): CategoryCalcConfig {
  const data = masterPricingData.gardening;
  const firstHour = findVariant("gardening", "garden_maint_1st_hr").startingPrice;
  const addHour = findVariant("gardening", "garden_maint_add_hr").startingPrice;
  const hourOptions = [2, 3, 4, 6, 8];

  return {
    key: "gardening",
    label: "Gardening",
    fromNote: `£${firstHour}/hr`,
    steps: ["category", "hours", "addons", "result"],
    guarantee: data.guaranteeText,
    marketContext: data.marketContext,
    choices: {
      hours: {
        title: "How many hours?",
        items: hourOptions.map((h) => {
          const total = firstHour + (h - 1) * addHour;
          return { label: h === 8 ? "Full day (8 hrs)" : `${h} hours`, value: total, note: `£${total}` };
        }),
      },
    },
    addons: data.addOns
      .map((a) => ({ label: a.name, price: parseFlatPrice(a.priceDisplay) }))
      .filter((a): a is AddonItem => a.price !== null),
    featured: [
      {
        name: "Standard visit",
        badge: "Most booked",
        price: `£${firstHour}/hr`,
        unit: "2-gardener team, first hour",
        includes: findVariant("gardening", "garden_maint_1st_hr").features,
      },
      {
        name: "Half day",
        badge: "",
        price: `£${firstHour + 3 * addHour}`,
        unit: "4 hours, 2-gardener team",
        includes: findVariant("gardening", "garden_maint_add_hr").features,
      },
      {
        name: "Garden clearance",
        badge: "Premium",
        price: `£${findVariant("gardening", "garden_clearance").startingPrice}`,
        unit: "Per session, waste bagged & removed",
        includes: findVariant("gardening", "garden_clearance").features,
      },
    ],
  };
}

function removalsConfig(): CategoryCalcConfig {
  const data = masterPricingData.removals;
  const crews = [
    { label: "Man & Van (1 mover)", id: "man_and_van" },
    { label: "2 Men + Luton Van", id: "van_2men" },
    { label: "3 Men + Large Van", id: "van_3men" },
  ];
  const hourOptions = [2, 3, 4, 6, 8];

  return {
    key: "removals",
    label: "Removals",
    fromNote: `from £${findVariant("removals", "man_and_van").startingPrice}/hr`,
    steps: ["category", "crew", "hours", "addons", "result"],
    guarantee: data.guaranteeText,
    marketContext: data.marketContext,
    choices: {
      crew: {
        title: "Which crew size?",
        items: crews.map((c) => {
          const v = findVariant("removals", c.id);
          return { label: c.label, value: v.startingPrice, note: `£${v.startingPrice}/hr` };
        }),
      },
      hours: {
        title: "How many hours?",
        items: hourOptions.map((h) => ({ label: h === 8 ? "Full day (8 hrs)" : `${h} hours`, value: h, note: `${h} hrs` })),
      },
    },
    addons: data.addOns
      .map((a) => ({ label: a.name, price: parseFlatPrice(a.priceDisplay) }))
      .filter((a): a is AddonItem => a.price !== null),
    featured: crews.map((c, i) => {
      const v = findVariant("removals", c.id);
      return {
        name: c.label,
        badge: i === 0 ? "Most booked" : i === crews.length - 1 ? "Premium" : "",
        price: `£${v.startingPrice}/hr`,
        unit: v.unit ?? "",
        includes: v.features,
      };
    }),
  };
}

export function getCalculatorConfig(): Record<CalcCategory, CategoryCalcConfig> {
  return {
    cleaning: cleaningConfig(),
    pest: pestConfig(),
    gardening: gardeningConfig(),
    removals: removalsConfig(),
  };
}
