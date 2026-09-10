"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Tick01Icon,
  RotateLeft01Icon,
  FlashIcon,
} from "@hugeicons/core-free-icons";
import type {
  ServiceCategory,
  JobType,
  PropertySize,
  Urgency,
} from "@/content/service-directory";
import {
  CATEGORY_DEFINITIONS,
  JOB_TYPE_DEFINITIONS,
  PROPERTY_SIZE_DEFINITIONS,
} from "@/content/service-directory";
import type { FilterState } from "@/lib/filter-matcher";
import type { CoverageCheckResult } from "@/lib/coverage-data";

interface CompactFilterSidebarProps {
  filters: FilterState;
  facetCounts: {
    categories: Record<ServiceCategory, number>;
    jobTypes: Record<JobType, number>;
    propertySizes: Record<PropertySize, number>;
  };
  postcodeCoverage: CoverageCheckResult | null;
  isPropertySizeRelevant: boolean;
  activeCount: number;
  onToggleCategory: (cat: ServiceCategory) => void;
  onToggleJobType: (job: JobType) => void;
  onTogglePropertySize: (size: PropertySize) => void;
  onSetUrgency: (urgency: Urgency | "all") => void;
  onSetPostcode: (postcode: string) => void;
  onClearAll: () => void;
}

export function CompactFilterSidebar({
  filters,
  facetCounts,
  postcodeCoverage,
  isPropertySizeRelevant,
  activeCount,
  onToggleCategory,
  onToggleJobType,
  onTogglePropertySize,
  onSetUrgency,
  onSetPostcode,
  onClearAll,
}: CompactFilterSidebarProps) {
  const categories: { key: ServiceCategory; icon: string }[] = [
    { key: "cleaning", icon: "🧹" },
    { key: "pest-control", icon: "🐭" },
    { key: "gardening", icon: "🌿" },
    { key: "removals", icon: "📦" },
  ];

  const jobTypes: JobType[] = ["one-off", "recurring", "inspection", "emergency"];
  const propertySizes: PropertySize[] = ["studio", "1-bed", "2-bed", "3-bed", "4-plus"];

  const isCovered = postcodeCoverage?.status === "AVAILABLE";

  return (
    <div className="bg-[#DCFAB7]/50 border-2 border-[#B7F56A] rounded-[22px] p-5 sm:p-6 shadow-2xs space-y-5 text-start">
      {/* 1. Header with Active Counter & Reset */}
      <div className="flex items-center justify-between border-b border-[#B7F56A]/40 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-base font-bold text-[#1F3A00]">
            Filter Services
          </h2>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 px-1.5 rounded-full bg-[#1F3A00] text-white text-[11px] font-bold font-mono">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-[#1F3A00]/70 hover:text-[#1F3A00] flex items-center gap-1 cursor-pointer"
          >
            <HugeiconsIcon icon={RotateLeft01Icon} size={13} strokeWidth={2} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 2. Verticals (Category) */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F3A00]/70">
          Service Category
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {categories.map(({ key, icon }) => {
            const isSelected = filters.categories.includes(key);
            const count = facetCounts.categories[key] ?? 0;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onToggleCategory(key)}
                className={`px-3 py-2 rounded-[10px] text-xs font-semibold flex items-center justify-between border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-white border-2 border-[#B7F56A] text-[#1F3A00] font-bold shadow-2xs"
                    : "bg-white/80 border border-[#B7F56A]/40 text-[#1F3A00]/80 hover:bg-white hover:border-[#B7F56A]"
                }`}
              >
                <span className="truncate flex items-center gap-1.5">
                  <span>{icon}</span>
                  <span>{CATEGORY_DEFINITIONS[key].label}</span>
                </span>
                <span className="text-[10px] font-mono text-[#1F3A00]/60 ml-1">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Job Type */}
      <div className="space-y-2 pt-1 border-t border-[#B7F56A]/40">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F3A00]/70">
          Job Type
        </span>
        <div className="flex flex-wrap gap-1.5">
          {jobTypes.map((jt) => {
            const isSelected = filters.jobTypes.includes(jt);
            const count = facetCounts.jobTypes[jt] ?? 0;
            return (
              <button
                key={jt}
                type="button"
                onClick={() => onToggleJobType(jt)}
                className={`px-2.5 py-1.5 rounded-[8px] text-xs font-medium border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#1F3A00] border-[#1F3A00] text-white font-semibold shadow-2xs"
                    : "bg-white/80 border border-[#B7F56A]/40 text-[#1F3A00]/80 hover:bg-white"
                }`}
              >
                <span>{JOB_TYPE_DEFINITIONS[jt].label}</span>
                <span className="text-[10px] ml-1 opacity-70 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Property Size (relevant for Cleaning & Removals) */}
      <div className="space-y-2 pt-1 border-t border-[#B7F56A]/40">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F3A00]/70">
            Property Size
          </span>
          {!isPropertySizeRelevant && (
            <span className="text-[10px] text-[#1F3A00]/50 italic">Cleaning & Removals</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {propertySizes.map((sz) => {
            const isSelected = filters.propertySizes.includes(sz);
            const count = facetCounts.propertySizes[sz] ?? 0;
            return (
              <button
                key={sz}
                type="button"
                onClick={() => onTogglePropertySize(sz)}
                className={`px-2.5 py-1.5 rounded-[8px] text-xs font-medium border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#1F3A00] border-[#1F3A00] text-white font-semibold shadow-2xs"
                    : "bg-white/80 border border-[#B7F56A]/40 text-[#1F3A00]/80 hover:bg-white"
                }`}
              >
                <span>{PROPERTY_SIZE_DEFINITIONS[sz].label}</span>
                <span className="text-[10px] ml-1 opacity-70 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Urgency / Dispatch */}
      <div className="space-y-2 pt-1 border-t border-[#B7F56A]/40">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F3A00]/70">
          Urgency & Timeline
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onSetUrgency(filters.urgency === "emergency" ? "all" : "emergency")}
            className={`px-2.5 py-2 rounded-[8px] text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
              filters.urgency === "emergency"
                ? "bg-[#B7F56A] border-2 border-[#99D055] text-[#1F3A00] font-bold shadow-2xs"
                : "bg-white/80 border border-[#B7F56A]/40 text-[#1F3A00]/80 hover:bg-white"
            }`}
          >
            <HugeiconsIcon icon={FlashIcon} size={14} strokeWidth={2} className="text-[#1F3A00]" />
            <span>⚡ Same-Day</span>
          </button>

          <button
            type="button"
            onClick={() => onSetUrgency(filters.urgency === "flexible" ? "all" : "flexible")}
            className={`px-2.5 py-2 rounded-[8px] text-xs font-semibold flex items-center justify-center gap-1 border transition-colors cursor-pointer ${
              filters.urgency === "flexible"
                ? "bg-white border-2 border-[#B7F56A] text-[#1F3A00] font-bold shadow-2xs"
                : "bg-white/80 border border-[#B7F56A]/40 text-[#1F3A00]/80 hover:bg-white"
            }`}
          >
            <span>🗓️ Flexible</span>
          </button>
        </div>
      </div>

      {/* 6. London Postcode Coverage Checker */}
      <div className="space-y-2 pt-1 border-t border-[#B7F56A]/40">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F3A00]/70">
          London Postcode
        </span>
        <div className="relative">
          <HugeiconsIcon
            icon={Location01Icon}
            size={15}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#1F3A00]/50"
          />
          <input
            type="text"
            value={filters.postcode}
            onChange={(e) => onSetPostcode(e.target.value)}
            placeholder="e.g. SW1, NW3, E14, RM8"
            className="w-full h-9 pl-8 pr-3 rounded-[8px] border-2 border-[#B7F56A] bg-white text-xs text-[#1F3A00] placeholder:text-[#1F3A00]/40 uppercase focus:border-[#99D055] focus:ring-2 focus:ring-[#B7F56A]/30 focus:outline-none transition-colors"
          />
        </div>

        {filters.postcode.trim() && postcodeCoverage && (
          <div
            className={`p-2.5 rounded-[10px] text-xs space-y-0.5 border ${
              isCovered
                ? "bg-white border-2 border-[#B7F56A] text-[#1F3A00]"
                : "bg-amber-50 border border-amber-200 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold text-[11px]">
              {isCovered ? (
                <>
                  <HugeiconsIcon icon={Tick01Icon} size={13} strokeWidth={2.4} className="text-emerald-700" />
                  <span>Covered ({postcodeCoverage.outcode || postcodeCoverage.postcode})</span>
                </>
              ) : (
                <span>Outer / Confirmation Required</span>
              )}
            </div>
            <p className="text-[11px] text-[#1F3A00]/70 leading-tight">
              {postcodeCoverage.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
