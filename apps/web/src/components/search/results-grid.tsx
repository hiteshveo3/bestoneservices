"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, AlertCircle, ArrowUpDown, ChevronDown } from "@/components/icons";
import { ServiceResultCard, ServiceResultCardSkeleton } from "./service-result-card";
import type { DirectoryService } from "@/content/service-directory";
import type { ActiveChip } from "@/lib/use-service-filters";

interface ResultsGridProps {
  services: DirectoryService[];
  isLoading?: boolean;
  activeChips: ActiveChip[];
  urgency: string;
  sort: "relevance" | "popular" | "alpha";
  onSortChange: (sort: "relevance" | "popular" | "alpha") => void;
  onClearAll: () => void;
}

const PAGE_SIZE = 12;

export function ResultsGrid({
  services,
  isLoading = false,
  activeChips,
  urgency,
  sort,
  onSortChange,
  onClearAll,
}: ResultsGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleServices = services.slice(0, visibleCount);
  const hasMore = visibleCount < services.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  // Popular fallback services for empty state
  const fallbackPopular = services.length === 0
    ? [
        {
          id: "end-of-tenancy-cleaning",
          name: "End of Tenancy Cleaning",
          category: "cleaning" as const,
          categoryLabel: "Cleaning",
          subService: "End of Tenancy",
          jobTypes: ["one-off" as const],
          startingPrice: "From £130",
          startingPriceNum: 130,
          emergencyEligible: true,
          description: "Agency-standard move out clean with 48-hour re-clean guarantee, covering full inventory checklists.",
          href: "/cleaning-services/end-of-tenancy-cleaning/",
          ctaText: "Get Instant Quote" as const,
          badges: ["Guaranteed"],
          aliases: [],
          imageSrc: "/images/service/best-one-cleaner-hero-v2.webp",
          popular: true,
        },
        {
          id: "mice-control",
          name: "Mice Control & Proofing",
          category: "pest-control" as const,
          categoryLabel: "Pest Control",
          subService: "Rodent Control",
          jobTypes: ["one-off" as const],
          startingPrice: "From £99",
          startingPriceNum: 99,
          emergencyEligible: true,
          description: "Targeted tamper-resistant bait stations, entry ingress surveys, and 1 to 3 month guarantee packages.",
          href: "/pest-control-services/mice-control/",
          ctaText: "Get Instant Quote" as const,
          badges: ["Written Guarantee"],
          aliases: [],
          imageSrc: "/images/service/best-one-pest-technician-hero-v1.webp",
          popular: true,
        },
        {
          id: "house-flat-removals",
          name: "House & Flat Removals (2 Men + Luton Van)",
          category: "removals" as const,
          categoryLabel: "Removals",
          subService: "House Removals",
          jobTypes: ["one-off" as const],
          startingPrice: "From £80/hr",
          startingPriceNum: 80,
          emergencyEligible: true,
          description: "Fully insured home moving crew with a Luton van equipped with tail lift and blankets.",
          href: "/removals/",
          ctaText: "Get Instant Quote" as const,
          badges: ["Insured"],
          aliases: [],
          imageSrc: "/images/service/best-one-team-hero-v1.webp",
          popular: true,
        },
      ]
    : [];

  return (
    <div className="space-y-6 text-start">
      {/* Persistent Emergency Urgency Banner */}
      {urgency === "emergency" && (
        <div className="p-4 sm:p-5 rounded-[18px] bg-[#B7F56A] text-[#1D201E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#B7F56A] animate-ping shrink-0" />
            <div>
              <p className="font-heading font-bold text-base sm:text-lg text-[#1D201E]">
                Need this urgently today?
              </p>
              <p className="text-xs sm:text-sm text-[#1D201E]/90">
                Direct dispatch line available across Greater London for same-day pest &amp; emergency calls.
              </p>
            </div>
          </div>
          <a
            href="tel:02080047788"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-[#B7F56A] hover:bg-[#A2EA4E] text-[#1D201E] font-bold text-sm whitespace-nowrap transition-colors "
          >
            <Phone className="w-4 h-4" />
            <span>Call 020 8004 7788</span>
          </a>
        </div>
      )}

      {/* Header Controls: Live count & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-[#ECEAE3] pb-4">
        <div aria-live="polite" className="text-sm font-semibold text-[#1D201E]">
          {isLoading ? (
            <span className="text-[#1D201E]/60">Searching services...</span>
          ) : (
            <span>
              Showing <span className="font-bold text-[#1D201E]">{services.length}</span>{" "}
              {services.length === 1 ? "service" : "services"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs font-semibold text-[#1D201E]/70 whitespace-nowrap">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as "relevance" | "popular" | "alpha")}
              className="appearance-none h-9 pl-3 pr-8 text-xs font-semibold bg-white border border-[#ECEAE3] rounded-[10px] text-[#1D201E] hover:border-[#ECEAE3] focus:border-[#1D201E] focus:outline-none cursor-pointer"
            >
              <option value="relevance">Most Relevant</option>
              <option value="popular">Most Popular</option>
              <option value="alpha">Alphabetical (A–Z)</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#1D201E]/60 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Loading Skeleton State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <ServiceResultCardSkeleton key={idx} />
          ))}
        </div>
      ) : services.length > 0 ? (
        /* Results Grid */
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {visibleServices.map((service) => (
              <ServiceResultCard
                key={service.id}
                service={service}
                highlightEmergency={urgency === "emergency"}
              />
            ))}
          </div>

          {/* Load More Pagination */}
          {hasMore && (
            <div className="flex flex-col items-center justify-center pt-4 pb-2 space-y-2">
              <button
                type="button"
                onClick={handleLoadMore}
                className="px-6 py-3 rounded-[14px] bg-white border-2 border-[#1D201E] hover:bg-[#B7F56A] hover:text-[#1D201E] text-[#1D201E] font-semibold text-sm transition-colors duration-150 cursor-pointer"
              >
                Load more ({services.length - visibleCount} remaining)
              </button>
              <span className="text-xs text-[#1D201E]/60">
                Viewing {visibleCount} of {services.length} services
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-[20px] p-8 sm:p-12 text-center space-y-6 ">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#EAF8D6]/60 flex items-center justify-center text-[#1D201E]">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-heading text-xl font-bold text-[#1D201E]">
              No services match all these filters
            </h3>
            <p className="text-sm text-[#1D201E]/70 leading-relaxed">
              Try removing some filters to broaden your search, or browse our most popular services below:
            </p>
          </div>

          {/* Active Chips in Empty State */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {activeChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={chip.onRemove}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[#EAF8D6]/70 hover:bg-[#B7F56A] text-[#1D201E] transition-colors cursor-pointer"
                >
                  <span>Remove {chip.label}</span>
                  <span>×</span>
                </button>
              ))}
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-bold text-[#1D201E] underline px-2 py-1"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Fallback Popular Services */}
          <div className="pt-6 border-[#ECEAE3] space-y-4 text-start">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1D201E]/70 text-center">
              Or Choose One of Our Core Services
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fallbackPopular.map((service) => (
                <ServiceResultCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
