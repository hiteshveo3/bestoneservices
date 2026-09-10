export interface SearchResultItem {
  id: string;
  title: string;
  category: "Services" | "Prices" | "Areas" | "Guides" | "Pages";
  href: string;
  badge?: string;
  aliases?: string[];
  priceDisplay?: string;
}

export const SEARCH_INDEX: SearchResultItem[] = [
  // CLEANING SERVICES
  {
    id: "end-of-tenancy",
    title: "End of Tenancy Cleaning",
    category: "Services",
    href: "/cleaning-services/end-of-tenancy-cleaning/",
    badge: "Popular",
    priceDisplay: "From £130",
    aliases: ["tenan", "move out cleaning", "end tenancy", "checkout clean", "flat clean", "deposit clean", "moveout"],
  },
  {
    id: "carpet-cleaning",
    title: "Carpet & Rug Steam Cleaning",
    category: "Services",
    href: "/cleaning-services/carpet-cleaning/",
    priceDisplay: "From £60",
    aliases: ["carpet", "rug", "steam clean", "stain removal", "hot water extraction"],
  },
  {
    id: "oven-cleaning",
    title: "Oven & Appliance Cleaning",
    category: "Services",
    href: "/cleaning-services/oven-cleaning-service/",
    priceDisplay: "From £45",
    aliases: ["oven", "hob", "cooker", "appliance", "range cooker"],
  },
  {
    id: "window-cleaning",
    title: "Window Cleaning",
    category: "Services",
    href: "/cleaning-services/window-cleaning/",
    priceDisplay: "From £40",
    aliases: ["window", "glass", "reach and wash", "sills"],
  },
  {
    id: "mattress-cleaning",
    title: "Mattress Steam Sanitising",
    category: "Services",
    href: "/cleaning-services/mattress-cleaning-service/",
    priceDisplay: "From £45",
    aliases: ["mattress", "bed clean", "dust mite", "sanitise"],
  },
  {
    id: "after-builders",
    title: "After Builders Cleaning",
    category: "Services",
    href: "/cleaning-services/after-builders-cleaning/",
    priceDisplay: "From £140",
    aliases: ["builder", "renovation clean", "dust clean", "post construction"],
  },

  // PEST CONTROL SERVICES
  {
    id: "mice-control",
    title: "Mice Control & Proofing",
    category: "Services",
    href: "/pest-control-services/mice-control/",
    badge: "Popular",
    priceDisplay: "From £99",
    aliases: ["mouse", "mice", "mouse exterminator", "rodent", "vermin"],
  },
  {
    id: "rat-control",
    title: "Rat Control Packages",
    category: "Services",
    href: "/pest-control-services/rat-control/",
    priceDisplay: "From £109",
    aliases: ["rat", "rats", "rodent control", "drain check"],
  },
  {
    id: "bed-bug-treatment",
    title: "Bed Bug Heat Treatment",
    category: "Services",
    href: "/pest-control-services/bed-bug-treatment/",
    priceDisplay: "From £149",
    aliases: ["bedbug", "bed bugs", "heat treatment", "bug spray"],
  },
  {
    id: "wasp-treatment",
    title: "Wasp Nest Removal",
    category: "Services",
    href: "/pest-control-services/wasp-treatment/",
    priceDisplay: "From £59",
    aliases: ["wasp", "wasps", "hornet", "nest removal", "bee removal"],
  },
  {
    id: "cockroach-control",
    title: "Cockroach Eradication",
    category: "Services",
    href: "/pest-control-services/cockroach-control/",
    priceDisplay: "From £119",
    aliases: ["cockroach", "cockroch", "cock", "roach", "gel baiting"],
  },
  {
    id: "flea-treatment",
    title: "Flea & Insect Spraying",
    category: "Services",
    href: "/pest-control-services/flea-treatment/",
    priceDisplay: "From £89",
    aliases: ["flea", "fleas", "insect control"],
  },
  {
    id: "ant-treatment",
    title: "Ant Treatment",
    category: "Services",
    href: "/pest-control-services/ant-treatment/",
    priceDisplay: "From £69",
    aliases: ["ant", "ants", "ant control", "ant nest"],
  },

  // GARDENING & REMOVALS
  {
    id: "gardening-main",
    title: "Garden Maintenance & Lawn Care",
    category: "Services",
    href: "/gardening/",
    badge: "Popular",
    priceDisplay: "£70/hr min",
    aliases: ["garden", "gardening", "lawn mowing", "hedge trimming", "yard cleaning"],
  },
  {
    id: "garden-clearance",
    title: "Garden Clearance & Waste Removal",
    category: "Services",
    href: "/gardening/",
    priceDisplay: "From £80",
    aliases: ["garden clear", "clearance", "overgrown garden", "waste bags"],
  },
  {
    id: "removals-main",
    title: "House Removals & Moving",
    category: "Services",
    href: "/removals/",
    badge: "Popular",
    priceDisplay: "From £80/hr",
    aliases: ["removals", "moving", "house move", "luton van"],
  },
  {
    id: "man-and-van",
    title: "Man & Van Moving Services",
    category: "Services",
    href: "/removals/",
    priceDisplay: "From £60/hr",
    aliases: ["man and van", "man with van", "van rental", "small move", "student move"],
  },

  // PRICES & AREAS
  {
    id: "pricing-page",
    title: "All Service Prices & Rates 2026",
    category: "Prices",
    href: "/prices/",
    badge: "Rates",
    aliases: ["price", "prices", "cost", "rates", "pricing", "quote"],
  },
  {
    id: "coverage-areas",
    title: "London Coverage Areas & Postcode Hubs",
    category: "Areas",
    href: "/areas/",
    aliases: ["area", "areas", "postcode", "london", "ilford", "barking", "newham", "m25"],
  },

  // GUIDES & PAGES
  {
    id: "guides-page",
    title: "Property Care & Cleaning Guides",
    category: "Guides",
    href: "/guides/",
    aliases: ["guide", "guides", "tips", "advice", "handover checklist"],
  },
  {
    id: "all-services-search",
    title: "All Services Directory & Filter",
    category: "Services",
    href: "/search",
    badge: "Filter",
    aliases: ["search", "filter", "all services", "find service", "directory", "verticals"],
  },
  {
    id: "about-page",
    title: "About Best One Services Ltd",
    category: "Pages",
    href: "/about/",
    aliases: ["about", "company", "team", "guarantee"],
  },
  {
    id: "contact-page",
    title: "Contact Support & Quotation Team",
    category: "Pages",
    href: "/contact/",
    aliases: ["contact", "phone", "email", "support", "help"],
  },
];

// Simple Levenshtein Distance algorithm for typo tolerance
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

/**
 * Weighted relevance search engine supporting exact titles, synonyms, partial queries, and fuzzy typo tolerance
 */
export function searchSite(query: string): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = SEARCH_INDEX.map((item) => {
    const titleLower = item.title.toLowerCase();
    let score = 0;

    // 1. Exact title match (100 pts)
    if (titleLower === q) score += 100;
    // 2. Exact alias match (80 pts)
    else if (item.aliases?.some((a) => a.toLowerCase() === q)) score += 80;
    // 3. Title starts with query (60 pts)
    else if (titleLower.startsWith(q)) score += 60;
    // 4. Strong partial title match (40 pts)
    else if (titleLower.includes(q)) score += 40;
    // 5. Alias partial match (30 pts)
    else if (item.aliases?.some((a) => a.toLowerCase().includes(q) || q.includes(a.toLowerCase()))) score += 30;

    // 6. Typo/fuzzy match for queries >= 4 chars (20 pts)
    if (q.length >= 4) {
      const words = titleLower.split(" ");
      for (const word of words) {
        if (word.length >= 4 && levenshtein(q, word) <= 2) {
          score += 20;
          break;
        }
      }
    }

    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.item);
}
