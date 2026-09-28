export type ImageVariant = "hero" | "content" | "card" | "square";

export const ASPECT_RATIOS: Record<ImageVariant, string> = {
  hero: "aspect-[4/3] max-h-[460px]",
  content: "aspect-[4/3]",
  card: "aspect-[3/2]",
  square: "aspect-square",
};

export const VERTICAL_IMAGES = {
  cleaning: {
    hero: "/images/service/best-one-cleaner-kitchen-v1.webp",
    alt: "Bestone Services Professional End of Tenancy Cleaning",
  },
  "pest-control": {
    hero: "/images/service/best-one-pest-technician-hero-v1.webp",
    alt: "Bestone Services Certified Pest Control Technician",
  },
  gardening: {
    hero: "/images/service/best-one-team-hero-v1.webp",
    alt: "Bestone Services 2-Gardener Maintenance Team",
  },
  removals: {
    hero: "/images/service/best-one-team-hero-v1.webp",
    alt: "Bestone Services House Removals & Moving Team",
  },
};
