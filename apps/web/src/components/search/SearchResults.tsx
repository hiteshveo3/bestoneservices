"use client";

import Link from "next/link";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Call02Icon,
  FilterIcon,
  Cancel01Icon,
  SparklesIcon,
  Tick01Icon,
  CheckmarkBadge01Icon,
  FlashIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import type { DirectoryService } from "@/content/service-directory";
import {
  CATEGORY_DEFINITIONS,
  JOB_TYPE_DEFINITIONS,
  PROPERTY_SIZE_DEFINITIONS,
} from "@/content/service-directory";
import { useServiceFilters } from "@/lib/use-service-filters";
import { SIDEBAR_CALL_BUTTON_CLASS } from "@/lib/ui-classes";
import { SearchField } from "./SearchField";
import { QuickFilterShortcuts } from "./quick-filter-shortcuts";
import { ActiveFilters, FilterBar, FilterDrawer, SortControl } from "./Filters";
import { ServiceCardMotion } from "@/components/service/service-card-motion";

export function describeSearch(filters: ReturnType<typeof useServiceFilters>["state"]): string {
  const parts: string[] = [];

  if (filters.query.trim()) {
    parts.push(`“${filters.query.trim()}”`);
  }

  if (filters.categories.length > 0) {
    parts.push(filters.categories.map((c) => CATEGORY_DEFINITIONS[c].label).join(" / "));
  }

  if (filters.jobTypes.length > 0) {
    parts.push(filters.jobTypes.map((j) => JOB_TYPE_DEFINITIONS[j].label).join(" / "));
  }

  if (filters.propertySizes.length > 0) {
    parts.push(filters.propertySizes.map((p) => PROPERTY_SIZE_DEFINITIONS[p].label).join(" / "));
  }

  if (filters.urgency !== "all") {
    parts.push(
      filters.urgency === "emergency"
        ? "Emergency Callout"
        : filters.urgency === "this-week"
          ? "This Week"
          : "Flexible"
    );
  }

  if (filters.postcode.trim()) {
    parts.push(`Area ${filters.postcode.trim().toUpperCase()}`);
  }

  return parts.length ? parts.join(" · ") : "All London Services";
}

export function SearchResults() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const {
    state,
    filteredServices,
    facetCounts,
    activeFilterCount,
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
  } = useServiceFilters();

  const heading = describeSearch(state);

  return (
    <div className="space-y-6">
      
      {/* 1. TOP STICKY FILTER TOOLBAR: Just like reference site */}
      <div className="sticky top-[56px] lg:top-[72px] z-30 bg-[#F9FCF5]/95 backdrop-blur-md border-b border-[#E5FBC9] py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {/* Row 1: Spacious Search Field + Sort Control + All Filters Drawer Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <div className="flex-1 min-w-0">
              <SearchField
                layout="inline"
                defaultValue={state.query}
                placeholder="Search services, pests, or problems (e.g. End of tenancy, Mice, Garden clearance)..."
                buttonLabel="Search"
                onSearch={setQuery}
              />
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2.5 shrink-0">
              {/* Sort Control */}
              <SortControl value={state.sort} onChange={setSort} />

              {/* All Filters Button */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="h-10 px-3.5 rounded-[12px] border border-[#E5FBC9] bg-white hover:border-[#B7F56A] hover:bg-[#F9FCF5] text-[#1F3A00] font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
                aria-label="Open filter drawer"
              >
                <HugeiconsIcon icon={FilterIcon} size={15} strokeWidth={2} />
                <span>All Filters</span>
                {activeFilterCount > 0 && (
                  <span className="inline-flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#1F3A00] text-[#B7F56A] text-[10px] font-bold font-mono">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Row 2: Desktop Quick Dropdowns (Verticals, Job Type, Size, Urgency, Postcode) */}
          <FilterBar
            filters={state}
            facetCounts={facetCounts}
            postcodeCoverage={postcodeCoverage}
            isPropertySizeRelevant={isPropertySizeRelevant}
            activeCount={activeFilterCount}
            onToggleCategory={toggleCategory}
            onToggleJobType={toggleJobType}
            onTogglePropertySize={togglePropertySize}
            onSetUrgency={setUrgency}
            onSetPostcode={setPostcode}
            onOpenDrawer={() => setMobileDrawerOpen(true)}
          />

          {/* Row 3: Active Filter Chips (Horizontally scrolling, never breaks into 2 lines) */}
          <ActiveFilters
            filters={state}
            onRemoveCategory={toggleCategory}
            onRemoveJobType={toggleJobType}
            onRemovePropertySize={togglePropertySize}
            onClearUrgency={() => setUrgency("all")}
            onClearPostcode={() => setPostcode("")}
            onClearAll={clearAllFilters}
          />
        </div>
      </div>

      {/* 2. MAIN BODY SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Quick Intent Shortcut Pills */}
        <QuickFilterShortcuts onSelect={applyQuickFilter} />

        {/* Title & Result Count */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5FBC9]">
          <div className="text-start">
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#1F3A00]">
              Services: {heading}
            </h1>
            <p className="text-xs text-[#1F3A00]/70 mt-0.5">
              <span className="font-mono font-bold text-[#1F3A00]">
                {filteredServices.length}
              </span>{" "}
              {filteredServices.length === 1 ? "service" : "services"} available across Greater London
            </p>
          </div>
        </div>

        {/* MAIN 2-COLUMN LAYOUT: Listings on Left, Exact Homepage / Service Page Sidebar on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Left Column: Service Listing Cards */}
          <div className="space-y-4">
            {filteredServices.length === 0 ? (
              <div className="rounded-[22px] bg-white border-2 border-[#B7F56A] p-8 sm:p-12 text-center shadow-2xs space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#DCFAB7]/60 text-[#1F3A00] flex items-center justify-center mx-auto">
                  <HugeiconsIcon icon={SparklesIcon} size={28} strokeWidth={1.8} />
                </div>
                <h2 className="font-heading text-xl font-bold text-[#1F3A00]">
                  No matching services found
                </h2>
                <p className="mx-auto max-w-md text-xs sm:text-sm text-[#1F3A00]/75 leading-relaxed">
                  None of our services match all active filters simultaneously. Try loosening your filter criteria or search keyword.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 rounded-[10px] bg-[#B7F56A] hover:bg-[#a8eb58] text-[#1F3A00] text-xs font-bold transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredServices.map((service) => (
                <ServiceCardItem key={service.id} service={service} />
              ))
            )}
          </div>

          {/* Right Column: Exact Homepage / Service Page Sticky Sidebar */}
          <aside className="hidden lg:flex lg:sticky lg:top-[230px] min-w-0 flex-col gap-4 bg-white border border-[#E5FBC9] rounded-[22px] p-6 shadow-2xs text-start">
            <p className="m-0 text-xs font-bold uppercase tracking-wider text-[#1F3A00]">
              Book a service
            </p>
            <h3 className="m-0 font-heading text-2xl font-semibold leading-tight text-[#1F3A00]">
              Fixed price in 60 seconds
            </h3>
            <p className="m-0 text-sm leading-relaxed text-[#1F3A00]">
              Choose your service and property size for an itemised quote with no callout fees — then pick a slot that suits you.
            </p>

            <Link
              href="/booking/"
              className="flex items-center justify-center w-full px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer shadow-2xs"
            >
              Get Instant Quote
            </Link>

            <a
              href="tel:02080047788"
              className={`flex items-center justify-center gap-2 w-full px-6 py-3 rounded-md font-inter text-base font-medium ${SIDEBAR_CALL_BUTTON_CLASS}`}
            >
              <HugeiconsIcon icon={Call02Icon} size={18} strokeWidth={1.8} className="text-[#1F3A00]" />
              <span>Call Us</span>
            </a>

            <div className="flex flex-col gap-1 pt-1 text-xs text-[#1F3A00]">
              <span className="flex items-center gap-2">
                Last reviewed:
                <span className="px-2 py-0.5 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] font-bold uppercase text-[10px] text-[#1F3A00]">
                  September 2026
                </span>
              </span>
              <span>All 32 boroughs · 7 days a week</span>
            </div>
          </aside>
        </div>
      </div>

      {/* 3. SLIDE-OVER DRAWER (Desktop & Mobile) */}
      <FilterDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        filters={state}
        facetCounts={facetCounts}
        postcodeCoverage={postcodeCoverage}
        isPropertySizeRelevant={isPropertySizeRelevant}
        onToggleCategory={toggleCategory}
        onToggleJobType={toggleJobType}
        onTogglePropertySize={togglePropertySize}
        onSetUrgency={setUrgency}
        onSetPostcode={setPostcode}
        onClearAll={clearAllFilters}
        resultCount={filteredServices.length}
      />
    </div>
  );
}

/* --- Service Card Item Component ------------------------------------------ */

function ServiceCardItem({
  service,
}: {
  service: DirectoryService;
}) {
  return (
    <article className="group bg-white rounded-[22px] border-2 border-[#E5FBC9] hover:border-[#B7F56A] transition-colors duration-200 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 shadow-2xs text-start">
      {/* Left Media Block */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full sm:w-[220px] md:w-[240px] shrink-0 rounded-[14px] overflow-hidden bg-[#F9FCF5] border border-[#E5FBC9]/60">
        <ServiceCardMotion category={service.category} serviceName={service.name} serviceId={service.id} />

        {/* Badges on Image */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          {service.popular && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B7F56A] text-[#1F3A00] border border-[#99D055] shadow-2xs">
              Popular
            </span>
          )}
          {service.emergencyEligible && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-[#1F3A00] border border-[#E5FBC9] shadow-2xs flex items-center gap-1">
              <HugeiconsIcon icon={FlashIcon} size={11} strokeWidth={2} className="text-[#1F3A00]" />
              <span>Same-Day</span>
            </span>
          )}
        </div>
      </div>

      {/* Right Content Block */}
      <div className="min-w-0 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFAB7]/70 text-[#1F3A00]">
              {service.categoryLabel}
            </span>
            <span className="text-xs text-[#1F3A00]/40">•</span>
            <span className="text-xs font-medium text-[#1F3A00]/75">
              {service.subService}
            </span>
            {service.emergencyEligible && (
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={14} strokeWidth={2} />
                <span>90-min SLA</span>
              </span>
            )}
          </div>

          {/* Title with link */}
          <h3 className="font-heading text-lg sm:text-xl font-bold text-[#1F3A00] leading-snug group-hover:underline underline-offset-2">
            <Link href={service.href} className="text-inherit">
              {service.name}
            </Link>
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#1F3A00]/80 leading-relaxed line-clamp-2">
            {service.description}
          </p>

          {/* Feature Guarantees */}
          {service.badges && service.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {service.badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F9FCF5] border border-[#E5FBC9] text-[11px] font-medium text-[#1F3A00]/75"
                >
                  <HugeiconsIcon icon={Tick01Icon} size={12} strokeWidth={2.4} className="text-emerald-700" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Dual Action Buttons */}
        <div className="pt-4 mt-3 border-t border-[#E5FBC9] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1F3A00]/60">
              Transparent Pricing
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-[#1F3A00]">
              {service.startingPrice}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:02080047788"
              className="h-10 px-3.5 rounded-[10px] bg-[#DCFAB7] border border-[#B7F56A] hover:bg-[#cbf79c] text-[#1F3A00] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HugeiconsIcon icon={Call02Icon} size={15} strokeWidth={1.8} className="text-[#1F3A00]" />
              <span className="hidden sm:inline">Call</span>
            </a>

            <Link
              href={service.href}
              className="h-10 px-4 rounded-[10px] bg-[#B7F56A] hover:bg-[#a8eb58] text-[#1F3A00] text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>{service.ctaText}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
