import {
  type DirectoryService,
  type ServiceCategory,
  type JobType,
  type PropertySize,
  type Urgency,
} from "../content/service-directory";

export interface FilterState {
  query: string;
  categories: ServiceCategory[];
  jobTypes: JobType[];
  propertySizes: PropertySize[];
  urgency: Urgency | "all";
  postcode: string;
  sort: "relevance" | "popular" | "alpha";
}

/**
 * Filter a service based on state, optionally omitting one facet for computing live facet counts.
 */
export function matchesFilters(
  service: DirectoryService,
  state: FilterState,
  omitFacet?: keyof FilterState
): boolean {
  // 1. Text Query Filter
  if (omitFacet !== "query" && state.query.trim()) {
    const q = state.query.toLowerCase().trim();
    const nameMatch = service.name.toLowerCase().includes(q);
    const descMatch = service.description.toLowerCase().includes(q);
    const subMatch = service.subService.toLowerCase().includes(q);
    const catMatch = service.categoryLabel.toLowerCase().includes(q);
    const aliasMatch = service.aliases.some((a) => a.toLowerCase().includes(q));

    if (!nameMatch && !descMatch && !subMatch && !catMatch && !aliasMatch) {
      return false;
    }
  }

  // 2. Category Filter
  if (omitFacet !== "categories" && state.categories.length > 0) {
    if (!state.categories.includes(service.category)) {
      return false;
    }
  }

  // 3. Job Type Filter
  if (omitFacet !== "jobTypes" && state.jobTypes.length > 0) {
    const hasJobType = state.jobTypes.some((jt) => service.jobTypes.includes(jt));
    if (!hasJobType) {
      return false;
    }
  }

  // 4. Property Size Filter
  if (omitFacet !== "propertySizes" && state.propertySizes.length > 0) {
    if (!service.propertySizes || service.propertySizes.length === 0) {
      return false;
    }
    const hasSize = state.propertySizes.some((ps) => service.propertySizes?.includes(ps));
    if (!hasSize) {
      return false;
    }
  }

  // 5. Urgency Filter
  if (omitFacet !== "urgency" && state.urgency !== "all") {
    if (state.urgency === "emergency" && !service.emergencyEligible) {
      return false;
    }
  }

  return true;
}
