export type ServiceArchetype = "cleaning" | "pest" | "gardening" | "removals";

export interface ArchetypeConfig {
  id: ServiceArchetype;
  calculatorMode: "embedded" | "linked" | "none";
  sections: string[];
}

export const ARCHETYPES: Record<ServiceArchetype, ArchetypeConfig> = {
  cleaning: {
    id: "cleaning",
    calculatorMode: "linked",
    sections: [
      "hero",
      "toc",
      "atAGlance",
      "scope",
      "pricingPreview",
      "priceFactors",
      "addons",
      "decisionSupport",
      "process",
      "structuredSummary",
      "locationContext",
      "trustProof",
      "reviews",
      "faq",
      "guides",
      "smartPricingCta",
      "finalCta",
    ],
  },
  pest: {
    id: "pest",
    calculatorMode: "linked",
    sections: [
      "hero",
      "toc",
      "atAGlance",
      "problemSigns",
      "treatmentOptions",
      "pricingPreview",
      "priceFactors",
      "process",
      "decisionSupport",
      "structuredSummary",
      "locationContext",
      "trustProof",
      "reviews",
      "faq",
      "guides",
      "smartPricingCta",
      "finalCta",
    ],
  },
  gardening: {
    id: "gardening",
    calculatorMode: "linked",
    sections: [
      "hero",
      "atAGlance",
      "scope",
      "pricingPreview",
      "priceFactors",
      "addons",
      "process",
      "locationContext",
      "trustProof",
      "reviews",
      "faq",
      "smartPricingCta",
      "finalCta",
    ],
  },
  removals: {
    id: "removals",
    calculatorMode: "linked",
    sections: [
      "hero",
      "atAGlance",
      "teamOptions",
      "pricingPreview",
      "priceFactors",
      "addons",
      "process",
      "locationContext",
      "trustProof",
      "reviews",
      "faq",
      "smartPricingCta",
      "finalCta",
    ],
  },
};
