import { z } from "zod";

const pageTargetSchema = z.object({ path: z.string().startsWith("/"), pageType: z.enum(["home", "service", "pest", "location", "guide", "comparison", "contact"]), primaryKeyword: z.string().min(3), secondaryKeywords: z.array(z.string()).default([]), searchIntent: z.enum(["commercial", "informational", "local"]), status: z.enum(["seed", "researched", "approved", "published"]), indexable: z.boolean(), image: z.string().startsWith("/").optional(), changeFrequency: z.enum(["daily", "weekly", "monthly", "yearly"]), priority: z.number().min(0).max(1) });
export type PageTarget = z.infer<typeof pageTargetSchema>;

// Only complete, active M1 pages belong in the XML sitemap. Future removal,
// gardening, account and booking routes remain reserved but unpublished.
export const pageRegistry = pageTargetSchema.array().parse([
  { path: "/", pageType: "home", primaryKeyword: "end of tenancy cleaning and pest control", secondaryKeywords: [], searchIntent: "commercial", status: "published", indexable: true, changeFrequency: "weekly", priority: 1 },
  { path: "/about/", pageType: "contact", primaryKeyword: "Bestone Services Ltd", secondaryKeywords: [], searchIntent: "informational", status: "published", indexable: true, changeFrequency: "yearly", priority: 0.6 },
  { path: "/contact/", pageType: "contact", primaryKeyword: "cleaning and pest control contact", secondaryKeywords: [], searchIntent: "commercial", status: "published", indexable: true, changeFrequency: "yearly", priority: 0.7 },
  { path: "/prices/", pageType: "service", primaryKeyword: "cleaning and pest control prices", secondaryKeywords: [], searchIntent: "commercial", status: "published", indexable: true, changeFrequency: "monthly", priority: 0.8 },
  { path: "/areas/", pageType: "location", primaryKeyword: "London cleaning and pest control", secondaryKeywords: [], searchIntent: "local", status: "published", indexable: true, changeFrequency: "monthly", priority: 0.7 },
  { path: "/guides/", pageType: "guide", primaryKeyword: "cleaning and pest control guides", secondaryKeywords: [], searchIntent: "informational", status: "published", indexable: true, changeFrequency: "monthly", priority: 0.6 },
  { path: "/pest-control-services/", pageType: "pest", primaryKeyword: "pest control services", secondaryKeywords: [], searchIntent: "commercial", status: "published", indexable: true, changeFrequency: "monthly", priority: 0.9 },
  { path: "/cleaning-services/", pageType: "service", primaryKeyword: "cleaning services", secondaryKeywords: [], searchIntent: "commercial", status: "published", indexable: true, changeFrequency: "monthly", priority: 0.9 },
  { path: "/cleaning-services/end-of-tenancy-cleaning/", pageType: "service", primaryKeyword: "end of tenancy cleaning", secondaryKeywords: [], searchIntent: "commercial", status: "published", indexable: true, changeFrequency: "monthly", priority: 0.9 },
  { path: "/pest-control-services/rat-control/", pageType: "pest", primaryKeyword: "rat control", secondaryKeywords: [], searchIntent: "commercial", status: "published", indexable: true, changeFrequency: "monthly", priority: 0.8 },
  { path: "/pest-control-services/mice-control/", pageType: "pest", primaryKeyword: "mice control", secondaryKeywords: [], searchIntent: "commercial", status: "published", indexable: true, changeFrequency: "monthly", priority: 0.8 },
  { path: "/pest-control-services/bed-bug-treatment/", pageType: "pest", primaryKeyword: "bed bug treatment", secondaryKeywords: [], searchIntent: "commercial", status: "published", indexable: true, changeFrequency: "monthly", priority: 0.8 },
  { path: "/pest-control-services/cockroach-control/", pageType: "pest", primaryKeyword: "cockroach control", secondaryKeywords: [], searchIntent: "commercial", status: "published", indexable: true, changeFrequency: "monthly", priority: 0.8 },
  { path: "/pest-control-services/ant-treatment/", pageType: "pest", primaryKeyword: "ant treatment", secondaryKeywords: [], searchIntent: "commercial", status: "published", indexable: true, changeFrequency: "monthly", priority: 0.8 },
  { path: "/pest-control-services/flea-treatment/", pageType: "pest", primaryKeyword: "flea treatment", secondaryKeywords: [], searchIntent: "commercial", status: "published", indexable: true, changeFrequency: "monthly", priority: 0.8 },
  { path: "/pest-control-services/wasp-treatment/", pageType: "pest", primaryKeyword: "wasp treatment", secondaryKeywords: [], searchIntent: "commercial", status: "published", indexable: true, changeFrequency: "monthly", priority: 0.8 },
]);
export const publishedPageTargets = pageRegistry.filter((page) => page.status === "published" && page.indexable);
