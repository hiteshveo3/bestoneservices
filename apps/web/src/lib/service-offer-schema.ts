import { masterPricingData, type PriceVariantData } from "@/config/pricing-data";

/**
 * Maps a service-catalog slug to the pricing-data.ts variant(s) that price it.
 * Deliberately explicit rather than fuzzy-matched — a wrong automatic guess
 * here would put an incorrect price into machine-readable schema, which is
 * worse than simply having no Offer schema for that service yet.
 *
 * A service slug not listed here (or not in the array for its category) has
 * no fixed price in pricing-data.ts, so it gets no Offer schema at all rather
 * than a fabricated one — this must stay true whenever pricing-data.ts changes.
 */
const SERVICE_TO_VARIANT_IDS: Record<string, string[]> = {
  // cleaning-services
  "end-of-tenancy-cleaning": ["studio_std", "studio_prem", "1bed_std", "1bed_prem", "2bed_std", "2bed_prem", "3bed_std", "3bed_prem", "4bed_std", "4bed_prem"],
  "domestic-cleaning": ["domestic_hourly"],
  "regular-cleaning": ["domestic_hourly"],
  "carpet-cleaning": ["carpet_cleaning_standalone"],
  "oven-cleaning-service": ["oven_cleaning_standalone"],
  "window-cleaning": ["window_cleaning_standalone"],
  "mattress-cleaning-service": ["mattress_cleaning_standalone"],
  "after-builders-cleaning": ["after_builders_standalone"],
  // pest-control-services
  "rat-control": ["species_rat"],
  "mice-control": ["species_mice"],
  "bed-bug-treatment": ["species_bed_bug"],
  "cockroach-control": ["species_cockroach"],
  "ant-treatment": ["species_ant"],
  "flea-treatment": ["species_flea"],
  "wasp-treatment": ["wasp_removal"],
  "dead-pest-removal": ["dead_animal"],
  // gardening
  "garden-clearance": ["garden_clearance"],
  // removals
  "man-and-van": ["man_and_van"],
};

function findVariants(serviceSlug: string): { categoryId: keyof typeof masterPricingData; variants: PriceVariantData[] } | null {
  const variantIds = SERVICE_TO_VARIANT_IDS[serviceSlug];
  if (!variantIds || variantIds.length === 0) return null;

  for (const categoryId of Object.keys(masterPricingData) as (keyof typeof masterPricingData)[]) {
    const variants = masterPricingData[categoryId].variants.filter((v) => variantIds.includes(v.id));
    if (variants.length > 0) return { categoryId, variants };
  }
  return null;
}

/**
 * Builds Product+Offer (or AggregateOffer, for a ranged price) JSON-LD nodes
 * for one service page, sourced entirely from pricing-data.ts. Returns an
 * empty array — not a guessed price — for any service with no fixed rate yet.
 */
export function generateServiceOfferSchema(serviceSlug: string, pageUrl: string): object[] {
  const found = findVariants(serviceSlug);
  if (!found) return [];

  const priceValidUntil = new Date();
  priceValidUntil.setMonth(priceValidUntil.getMonth() + 3);
  const priceValidUntilStr = priceValidUntil.toISOString().slice(0, 10);

  return found.variants.map((v) => ({
    "@type": "Product",
    "@id": `${pageUrl}#offer-${v.id}`,
    name: v.name,
    description: `${v.name} — ${v.features.join(", ")}`,
    offers: v.maxPrice
      ? {
          "@type": "AggregateOffer",
          lowPrice: v.startingPrice,
          highPrice: v.maxPrice,
          priceCurrency: "GBP",
          areaServed: "Greater London",
          availability: "https://schema.org/InStock",
          priceValidUntil: priceValidUntilStr,
          url: pageUrl,
        }
      : {
          "@type": "Offer",
          price: v.startingPrice,
          priceCurrency: "GBP",
          areaServed: "Greater London",
          availability: "https://schema.org/InStock",
          priceValidUntil: priceValidUntilStr,
          url: pageUrl,
        },
  }));
}

/** Natural-language cost Q&A, phrased the way someone would ask an AI assistant. */
export function generateCostFaqSchema(serviceSlug: string, serviceTitle: string): { question: string; answer: string }[] {
  const found = findVariants(serviceSlug);
  if (!found) return [];

  const cheapest = found.variants.reduce((min, v) => (v.startingPrice < min.startingPrice ? v : min), found.variants[0]);
  const priceText = cheapest.maxPrice ? `£${cheapest.startingPrice}–£${cheapest.maxPrice}` : `£${cheapest.startingPrice}`;

  return [
    {
      question: `How much does ${serviceTitle.toLowerCase()} cost in London?`,
      answer: `${serviceTitle} starts from ${priceText} with Best One Services, covering Greater London and the M25. The exact price depends on property size and scope, and is confirmed in writing before any work begins.`,
    },
  ];
}
