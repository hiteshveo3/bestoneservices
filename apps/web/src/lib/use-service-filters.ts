"use client";

import { useMemo, useCallback, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  SERVICES_DIRECTORY,
  type DirectoryService,
  type ServiceCategory,
  type JobType,
  type PropertySize,
  type Urgency,
} from "@/content/service-directory";
import { checkPostcodeAvailability } from "@/lib/coverage-data";

import {
  type FilterState,
  matchesFilters,
} from "@/lib/filter-matcher";

export type { FilterState };
export { matchesFilters };

export interface ActiveChip {
  id: string;
  label: string;
  group: keyof FilterState;
  onRemove: () => void;
}

export type QuickFilterKey = "moving-out" | "pest-emergency" | "garden-tidy" | "van-only" | "maintenance";

const DEFAULT_STATE: FilterState = {
  query: "",
  categories: [],
  jobTypes: [],
  propertySizes: [],
  urgency: "all",
  postcode: "",
  sort: "relevance",
};

export function useServiceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial filter state from URL params
  const urlState: FilterState = useMemo(() => {
    const q = searchParams.get("q") || "";
    const catParam = searchParams.get("category");
    const jobParam = searchParams.get("job_type") || searchParams.get("jobType");
    const sizeParam = searchParams.get("property_size") || searchParams.get("propertySize") || searchParams.get("bedrooms");
    const urgParam = searchParams.get("urgency");
    const pcParam = searchParams.get("postcode") || "";
    const sortParam = searchParams.get("sort");

    const categories = catParam
      ? (catParam.split(",").filter((c) =>
          ["cleaning", "pest-control", "gardening", "removals"].includes(c)
        ) as ServiceCategory[])
      : [];

    const jobTypes = jobParam
      ? (jobParam.split(",").filter((jt) =>
          ["one-off", "recurring", "inspection", "emergency"].includes(jt)
        ) as JobType[])
      : [];

    const propertySizes = sizeParam
      ? (sizeParam.split(",").filter((ps) =>
          ["studio", "1-bed", "2-bed", "3-bed", "4-plus", "commercial"].includes(ps)
        ) as PropertySize[])
      : [];

    const urgency: Urgency | "all" =
      urgParam === "emergency" || urgParam === "this-week" || urgParam === "flexible"
        ? urgParam
        : "all";

    const sort: "relevance" | "popular" | "alpha" =
      sortParam === "popular" || sortParam === "alpha" ? sortParam : "relevance";

    return {
      query: q,
      categories,
      jobTypes,
      propertySizes,
      urgency,
      postcode: pcParam,
      sort,
    };
  }, [searchParams]);

  const [state, setState] = useState<FilterState>(urlState);
  // Tracks the urlState reference (stable via useMemo above) so a change
  // driven externally — e.g. browser back/forward — can be detected and
  // applied during render, per React's documented pattern for adjusting
  // state from derived values. Avoids the extra render + flash that
  // committing this in an effect would cause.
  const [syncedUrlState, setSyncedUrlState] = useState(urlState);

  if (urlState !== syncedUrlState) {
    setSyncedUrlState(urlState);
    setState(urlState);
  }

  // Synchronize state with URL search params using router.replace (avoids history pollution)
  const syncToUrl = useCallback(
    (newState: FilterState) => {
      const params = new URLSearchParams();

      if (newState.query.trim()) params.set("q", newState.query.trim());
      if (newState.categories.length > 0) params.set("category", newState.categories.join(","));
      if (newState.jobTypes.length > 0) params.set("job_type", newState.jobTypes.join(","));
      if (newState.propertySizes.length > 0) params.set("property_size", newState.propertySizes.join(","));
      if (newState.urgency !== "all") params.set("urgency", newState.urgency);
      if (newState.postcode.trim()) params.set("postcode", newState.postcode.trim());
      if (newState.sort !== "relevance") params.set("sort", newState.sort);

      const qs = params.toString();
      const targetUrl = qs ? `${pathname}?${qs}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [pathname, router]
  );

  const updateState = useCallback(
    (updater: Partial<FilterState> | ((prev: FilterState) => FilterState)) => {
      setState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
        syncToUrl(next);
        return next;
      });
    },
    [syncToUrl]
  );

  // Filter setters
  const setQuery = useCallback((query: string) => updateState({ query }), [updateState]);

  const toggleCategory = useCallback(
    (category: ServiceCategory) => {
      updateState((prev) => {
        const next = prev.categories.includes(category)
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category];
        return { ...prev, categories: next };
      });
    },
    [updateState]
  );

  const toggleJobType = useCallback(
    (jobType: JobType) => {
      updateState((prev) => {
        const next = prev.jobTypes.includes(jobType)
          ? prev.jobTypes.filter((jt) => jt !== jobType)
          : [...prev.jobTypes, jobType];
        return { ...prev, jobTypes: next };
      });
    },
    [updateState]
  );

  const togglePropertySize = useCallback(
    (size: PropertySize) => {
      updateState((prev) => {
        const next = prev.propertySizes.includes(size)
          ? prev.propertySizes.filter((s) => s !== size)
          : [...prev.propertySizes, size];
        return { ...prev, propertySizes: next };
      });
    },
    [updateState]
  );

  const setUrgency = useCallback(
    (urgency: Urgency | "all") => {
      updateState({ urgency });
    },
    [updateState]
  );

  const setPostcode = useCallback(
    (postcode: string) => {
      updateState({ postcode });
    },
    [updateState]
  );

  const setSort = useCallback(
    (sort: "relevance" | "popular" | "alpha") => {
      updateState({ sort });
    },
    [updateState]
  );

  const clearAllFilters = useCallback(() => {
    updateState(DEFAULT_STATE);
  }, [updateState]);

  // Quick Filter Shortcuts
  const applyQuickFilter = useCallback(
    (key: QuickFilterKey) => {
      switch (key) {
        case "moving-out":
          updateState({
            categories: ["cleaning", "removals"],
            jobTypes: [],
            propertySizes: [],
            urgency: "all",
            query: "",
          });
          break;
        case "pest-emergency":
          updateState({
            categories: ["pest-control"],
            urgency: "emergency",
            jobTypes: [],
            propertySizes: [],
            query: "",
          });
          break;
        case "garden-tidy":
          updateState({
            categories: ["gardening"],
            jobTypes: [],
            propertySizes: [],
            urgency: "all",
            query: "",
          });
          break;
        case "van-only":
          updateState({
            categories: ["removals"],
            jobTypes: ["one-off"],
            propertySizes: [],
            urgency: "all",
            query: "",
          });
          break;
        case "maintenance":
          updateState({
            jobTypes: ["recurring"],
            categories: [],
            propertySizes: [],
            urgency: "all",
            query: "",
          });
          break;
      }
    },
    [updateState]
  );

  // Compute filtered services
  const filteredServices = useMemo(() => {
    let result = SERVICES_DIRECTORY.filter((service) => matchesFilters(service, state));

    // Sort result
    if (state.sort === "popular") {
      result = [...result].sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return a.name.localeCompare(b.name);
      });
    } else if (state.sort === "alpha") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // "relevance" sort
      if (state.query.trim()) {
        const q = state.query.toLowerCase().trim();
        result = [...result].sort((a, b) => {
          const aName = a.name.toLowerCase().includes(q) ? 3 : 0;
          const bName = b.name.toLowerCase().includes(q) ? 3 : 0;
          const aAlias = a.aliases.some((al) => al.toLowerCase().includes(q)) ? 2 : 0;
          const bAlias = b.aliases.some((al) => al.toLowerCase().includes(q)) ? 2 : 0;
          const aScore = aName + aAlias + (a.popular ? 1 : 0);
          const bScore = bName + bAlias + (b.popular ? 1 : 0);
          return bScore - aScore;
        });
      } else {
        result = [...result].sort((a, b) => {
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return 0;
        });
      }
    }

    return result;
  }, [state]);

  // Compute dynamic facet counts (faceted search)
  const facetCounts = useMemo(() => {
    const categoryCounts: Record<ServiceCategory, number> = {
      cleaning: 0,
      "pest-control": 0,
      gardening: 0,
      removals: 0,
    };

    const jobTypeCounts: Record<JobType, number> = {
      "one-off": 0,
      recurring: 0,
      inspection: 0,
      emergency: 0,
    };

    const propertySizeCounts: Record<PropertySize, number> = {
      studio: 0,
      "1-bed": 0,
      "2-bed": 0,
      "3-bed": 0,
      "4-plus": 0,
      commercial: 0,
    };

    // Category facet counts (holding other filters fixed)
    for (const cat of ["cleaning", "pest-control", "gardening", "removals"] as ServiceCategory[]) {
      categoryCounts[cat] = SERVICES_DIRECTORY.filter(
        (s) => s.category === cat && matchesFilters(s, state, "categories")
      ).length;
    }

    // Job type facet counts
    for (const jt of ["one-off", "recurring", "inspection", "emergency"] as JobType[]) {
      jobTypeCounts[jt] = SERVICES_DIRECTORY.filter(
        (s) => s.jobTypes.includes(jt) && matchesFilters(s, state, "jobTypes")
      ).length;
    }

    // Property size facet counts
    for (const ps of ["studio", "1-bed", "2-bed", "3-bed", "4-plus", "commercial"] as PropertySize[]) {
      propertySizeCounts[ps] = SERVICES_DIRECTORY.filter(
        (s) => s.propertySizes?.includes(ps) && matchesFilters(s, state, "propertySizes")
      ).length;
    }

    return {
      categories: categoryCounts,
      jobTypes: jobTypeCounts,
      propertySizes: propertySizeCounts,
    };
  }, [state]);

  // Active filter chips
  const activeChips: ActiveChip[] = useMemo(() => {
    const chips: ActiveChip[] = [];

    if (state.query.trim()) {
      chips.push({
        id: `q-${state.query}`,
        label: `"${state.query}"`,
        group: "query",
        onRemove: () => setQuery(""),
      });
    }

    for (const cat of state.categories) {
      const label =
        cat === "cleaning"
          ? "Cleaning"
          : cat === "pest-control"
          ? "Pest Control"
          : cat === "gardening"
          ? "Gardening"
          : "Removals";
      chips.push({
        id: `cat-${cat}`,
        label,
        group: "categories",
        onRemove: () => toggleCategory(cat),
      });
    }

    for (const jt of state.jobTypes) {
      const label =
        jt === "one-off"
          ? "One-Off"
          : jt === "recurring"
          ? "Recurring"
          : jt === "inspection"
          ? "Inspection"
          : "Emergency Callout";
      chips.push({
        id: `jt-${jt}`,
        label,
        group: "jobTypes",
        onRemove: () => toggleJobType(jt),
      });
    }

    for (const ps of state.propertySizes) {
      const label =
        ps === "studio"
          ? "Studio"
          : ps === "1-bed"
          ? "1 Bed"
          : ps === "2-bed"
          ? "2 Bed"
          : ps === "3-bed"
          ? "3 Bed"
          : ps === "4-plus"
          ? "4+ Bed"
          : "Commercial";
      chips.push({
        id: `ps-${ps}`,
        label,
        group: "propertySizes",
        onRemove: () => togglePropertySize(ps),
      });
    }

    if (state.urgency !== "all") {
      const label =
        state.urgency === "emergency"
          ? "Emergency (Today)"
          : state.urgency === "this-week"
          ? "This Week"
          : "Flexible";
      chips.push({
        id: `urg-${state.urgency}`,
        label,
        group: "urgency",
        onRemove: () => setUrgency("all"),
      });
    }

    if (state.postcode.trim()) {
      chips.push({
        id: `pc-${state.postcode}`,
        label: `Postcode: ${state.postcode.toUpperCase()}`,
        group: "postcode",
        onRemove: () => setPostcode(""),
      });
    }

    return chips;
  }, [state, setQuery, toggleCategory, toggleJobType, togglePropertySize, setUrgency, setPostcode]);

  // Postcode coverage validation
  const postcodeCoverage = useMemo(() => {
    if (!state.postcode.trim()) return null;
    return checkPostcodeAvailability(state.postcode);
  }, [state.postcode]);

  // Whether property size filter is relevant (only relevant for Cleaning and Removals)
  const isPropertySizeRelevant = useMemo(() => {
    if (state.categories.length === 0) return true;
    return state.categories.includes("cleaning") || state.categories.includes("removals");
  }, [state.categories]);

  return {
    state,
    filteredServices,
    totalCount: filteredServices.length,
    catalogTotal: SERVICES_DIRECTORY.length,
    facetCounts,
    activeChips,
    activeFilterCount: activeChips.length,
    postcodeCoverage,
    isPropertySizeRelevant,
    setQuery,
    toggleCategory,
    toggleJobType,
    togglePropertySize,
    setUrgency,
    setPostcode,
    setSort,
    clearAllFilters,
    applyQuickFilter,
  };
}
