import { SEARCH_INDEX, type SearchResultItem } from "./search-index";

export interface RecommendationSignalInput {
  currentServiceId: string;
  category: string;
  recentlyViewedCategories?: string[];
  limit?: number;
}

export function getRecommendedServices({
  currentServiceId,
  category,
  recentlyViewedCategories = [],
  limit = 4,
}: RecommendationSignalInput): SearchResultItem[] {
  const allServices = SEARCH_INDEX.filter((i) => i.category === "Services" && i.id !== currentServiceId);

  // Score each service
  const scored = allServices.map((service) => {
    let score = 0;

    // 1. Same category match (+30 pts)
    if (service.href.includes(category.toLowerCase())) {
      score += 30;
    }

    // 2. Explicit complementary relationship mapping (+50 pts)
    const complementaryMap: Record<string, string[]> = {
      "end-of-tenancy": ["carpet-cleaning", "oven-cleaning", "window-cleaning", "mattress-cleaning"],
      "carpet-cleaning": ["end-of-tenancy", "mattress-cleaning", "oven-cleaning"],
      "mice-control": ["rat-control", "cockroach-control", "wasp-treatment"],
      "rat-control": ["mice-control", "cockroach-control"],
      "gardening-main": ["garden-clearance", "removals-main"],
      "removals-main": ["man-and-van", "end-of-tenancy", "gardening-main"],
    };

    const targetComplements = complementaryMap[currentServiceId] || [];
    if (targetComplements.includes(service.id)) {
      score += 50;
    }

    // 3. User recently viewed category match (+20 pts)
    if (recentlyViewedCategories.some((cat) => service.href.includes(cat.toLowerCase()))) {
      score += 20;
    }

    // 4. Popular badge priority (+10 pts)
    if (service.badge === "Popular") {
      score += 10;
    }

    return { service, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.service);
}
