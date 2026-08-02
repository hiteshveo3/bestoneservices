import { z } from "zod";

const pageTargetSchema = z.object({
  path: z.string().startsWith("/"),
  pageType: z.enum(["home", "service", "pest", "location", "guide", "comparison", "contact"]),
  primaryKeyword: z.string().min(3),
  secondaryKeywords: z.array(z.string()).default([]),
  searchIntent: z.enum(["commercial", "informational", "local"]),
  status: z.enum(["seed", "researched", "approved", "published"]),
  indexable: z.boolean(),
  image: z.string().startsWith("/").optional(),
  changeFrequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  priority: z.number().min(0).max(1),
});

export type PageTarget = z.infer<typeof pageTargetSchema>;

/*
 * This registry is the source of truth for indexable pages. Seed terms are
 * directional only until keyword research and the matching business facts
 * have been approved. Draft or unverified pages must not enter the sitemap.
 */
export const pageRegistry = z.array(pageTargetSchema).parse([
  {
    path: "/",
    pageType: "home",
    primaryKeyword: "end of tenancy cleaning and pest control",
    secondaryKeywords: ["property cleaning and pest control services"],
    searchIntent: "commercial",
    status: "published",
    indexable: true,
    image: "/images/end-of-tenancy-hero.jpg",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/end-of-tenancy-cleaning/",
    pageType: "service",
    primaryKeyword: "end of tenancy cleaning",
    secondaryKeywords: [
      "move out cleaning",
      "end of tenancy cleaners",
      "rental property cleaning",
    ],
    searchIntent: "commercial",
    status: "published",
    indexable: true,
    image: "/images/end-of-tenancy-hero.jpg",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/pest-control/",
    pageType: "pest",
    primaryKeyword: "pest control services",
    secondaryKeywords: [
      "home pest control",
      "commercial pest control",
      "rat mice and bed bug control",
    ],
    searchIntent: "commercial",
    status: "published",
    indexable: true,
    image: "/images/pest-inspection.jpg",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/pest-control-ilford/",
    pageType: "location",
    primaryKeyword: "pest control Ilford",
    secondaryKeywords: [
      "pest control in Ilford",
      "Ilford pest control services",
      "exterminator Ilford",
    ],
    searchIntent: "local",
    status: "published",
    indexable: true,
    image: "/images/pest-inspection.jpg",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/get-a-quote/",
    pageType: "contact",
    primaryKeyword: "cleaning and pest control quote",
    secondaryKeywords: ["end of tenancy cleaning quote", "pest control quote"],
    searchIntent: "commercial",
    status: "published",
    indexable: true,
    changeFrequency: "yearly",
    priority: 0.8,
  },
  {
    path: "/about/",
    pageType: "contact",
    primaryKeyword: "Bestone Services Ltd London",
    secondaryKeywords: ["London cleaning and pest control company", "BPCA pest control London"],
    searchIntent: "informational",
    status: "published",
    indexable: true,
    changeFrequency: "yearly",
    priority: 0.6,
  },
]);

export const publishedPageTargets = pageRegistry.filter(
  (page) => page.status === "published" && page.indexable,
);
