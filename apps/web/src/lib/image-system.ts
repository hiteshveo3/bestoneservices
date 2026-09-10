export type ImageVariant = "hero" | "content" | "card" | "square";

export const ASPECT_RATIOS: Record<ImageVariant, string> = {
  hero: "aspect-[4/3] max-h-[460px]",
  content: "aspect-[4/3]",
  card: "aspect-[3/2]",
  square: "aspect-square",
};

export const VERTICAL_IMAGES = {
  cleaning: {
    hero: "/images/service-card-cleaning-v1.png",
    alt: "Best One Services Professional End of Tenancy Cleaning",
  },
  "pest-control": {
    hero: "/images/service-card-pest-control-v1.png",
    alt: "Best One Services Certified Pest Control Technician",
  },
  gardening: {
    hero: "/images/service-card-gardening-v1.png",
    alt: "Best One Services 2-Gardener Maintenance Team",
  },
  removals: {
    hero: "/images/service-card-removals-v1.png",
    alt: "Best One Services House Removals & Moving Team",
  },
};
