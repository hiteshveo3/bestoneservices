"use client";

import { useState } from "react";
import { 
  ChevronDown, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Bug, 
  Trees, 
  Truck 
} from "lucide-react";
import {
  CATEGORY_DEFINITIONS,
  JOB_TYPE_DEFINITIONS,
  PROPERTY_SIZE_DEFINITIONS,
  type ServiceCategory,
  type JobType,
  type PropertySize,
  type Urgency,
} from "@/content/service-directory";
import type { FilterState } from "@/lib/use-service-filters";
import type { CoverageCheckResult } from "@/lib/coverage-data";

interface FilterSidebarProps {
  state: FilterState;
  facetCounts: {
    categories: Record<ServiceCategory, number>;
    jobTypes: Record<JobType, number>;
    propertySizes: Record<PropertySize, number>;
  };
  postcodeCoverage: CoverageCheckResult | null;
  isPropertySizeRelevant: boolean;
  onToggleCategory: (cat: ServiceCategory) => void;
  onToggleJobType: (jt: JobType) => void;
  onTogglePropertySize: (ps: PropertySize) => void;
  onSetUrgency: (urgency: Urgency | "all") => void;
  onSetPostcode: (postcode: string) => void;
  onClearAll: () => void;
  className?: string;
}

const CATEGORY_ICONS: Record<ServiceCategory, typeof Sparkles> = {
  cleaning: Sparkles,
  "pest-control": Bug,
  gardening: Trees,
  removals: Truck,
};

export function FilterSidebar({
  state,
  facetCounts,
  postcodeCoverage,
  isPropertySizeRelevant,
  onToggleCategory,
  onToggleJobType,
  onTogglePropertySize,
  onSetUrgency,
  onSetPostcode,
  onClearAll,
  className = "",
}: FilterSidebarProps) {
  const [postcodeInput, setPostcodeInput] = useState(state.postcode);
  const [propertySizeExpanded, setPropertySizeExpanded] = useState(isPropertySizeRelevant);

  const handlePostcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetPostcode(postcodeInput.trim().toUpperCase());
  };

  const categories: ServiceCategory[] = ["cleaning", "pest-control", "gardening", "removals"];
  const jobTypes: JobType[] = ["one-off", "recurring", "inspection", "emergency"];
  const propertySizes: PropertySize[] = ["studio", "1-bed", "2-bed", "3-bed", "4-plus", "commercial"];

  return (
    <aside
      className={`w-full bg-white border border-[#E5FBC9] rounded-[20px] p-5 lg:p-6 shadow-2xs space-y-6 text-start ${className}`}
      aria-label="Service filters"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-[#E5FBC9] pb-4">
        <h2 className="font-heading text-lg font-bold text-[#1F3A00]">
          Filter Services
        </h2>
        {(state.categories.length > 0 ||
          state.jobTypes.length > 0 ||
          state.propertySizes.length > 0 ||
          state.urgency !== "all" ||
          state.postcode) && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-[#1F3A00]/70 hover:text-[#1F3A00] hover:underline cursor-pointer transition-colors duration-150"
          >
            Reset all
          </button>
        )}
      </div>

      {/* GROUP 1: Service Category */}
      <fieldset className="space-y-3 border-0 p-0 m-0">
        <legend className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1F3A00]/80 mb-2 block">
          1. Service Vertical
        </legend>
        <div className="space-y-2">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            const isChecked = state.categories.includes(cat);
            const count = facetCounts.categories[cat];

            return (
              <label
                key={cat}
                className={`flex items-center justify-between px-3 py-2.5 rounded-[14px] border transition-colors duration-150 cursor-pointer select-none ${
                  isChecked
                    ? "bg-[#DCFAB7]/80 border-[#99D055] font-semibold text-[#1F3A00]"
                    : "bg-[#F9FCF5] hover:bg-[#DCFAB7]/30 border-[#E5FBC9] text-[#1F3A00]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleCategory(cat)}
                    className="w-4 h-4 rounded border-[#99D055] text-[#1F3A00] accent-[#1F3A00] focus:ring-[#99D055] cursor-pointer"
                  />
                  <Icon className="w-4 h-4 text-[#1F3A00] shrink-0" />
                  <span className="text-sm truncate">{CATEGORY_DEFINITIONS[cat].label}</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                    isChecked
                      ? "bg-[#1F3A00] text-white font-semibold"
                      : "bg-white border border-[#E5FBC9] text-[#1F3A00]/70"
                  }`}
                >
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* GROUP 2: Job Type */}
      <fieldset className="space-y-3 border-t border-[#E5FBC9] pt-5 p-0 m-0">
        <legend className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1F3A00]/80 mb-2 block">
          2. Job Type
        </legend>
        <div className="space-y-2">
          {jobTypes.map((jt) => {
            const isChecked = state.jobTypes.includes(jt);
            const count = facetCounts.jobTypes[jt];

            return (
              <label
                key={jt}
                className={`flex items-center justify-between px-3 py-2 rounded-[12px] border transition-colors duration-150 cursor-pointer select-none ${
                  isChecked
                    ? "bg-[#DCFAB7]/60 border-[#99D055] font-medium text-[#1F3A00]"
                    : "bg-[#F9FCF5] hover:bg-[#DCFAB7]/20 border-transparent text-[#1F3A00]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleJobType(jt)}
                    className="w-4 h-4 rounded border-[#99D055] text-[#1F3A00] accent-[#1F3A00] focus:ring-[#99D055] cursor-pointer"
                  />
                  <span className="text-sm truncate">{JOB_TYPE_DEFINITIONS[jt].label}</span>
                </div>
                <span className="text-xs text-[#1F3A00]/60 font-mono">({count})</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* GROUP 3: Property Type & Size (Smart Conditional Visibility) */}
      <fieldset className="border-t border-[#E5FBC9] pt-5 p-0 m-0 space-y-3">
        <div className="flex items-center justify-between">
          <legend className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1F3A00]/80 block">
            3. Property Size
          </legend>
          {!isPropertySizeRelevant && (
            <button
              type="button"
              onClick={() => setPropertySizeExpanded(!propertySizeExpanded)}
              className="text-[11px] font-semibold text-[#1F3A00]/60 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{propertySizeExpanded ? "Hide" : "Show"}</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${propertySizeExpanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>

        {!isPropertySizeRelevant && !propertySizeExpanded ? (
          <p className="text-xs text-[#1F3A00]/60 bg-[#F9FCF5] p-2.5 rounded-md border border-[#E5FBC9]">
            Property size tiers apply to Cleaning and Removals.
          </p>
        ) : (
          <div className="space-y-1.5">
            {propertySizes.map((ps) => {
              const isChecked = state.propertySizes.includes(ps);
              const count = facetCounts.propertySizes[ps];

              return (
                <label
                  key={ps}
                  className={`flex items-center justify-between px-3 py-2 rounded-[12px] border transition-colors duration-150 cursor-pointer select-none ${
                    isChecked
                      ? "bg-[#DCFAB7]/60 border-[#99D055] font-medium text-[#1F3A00]"
                      : "bg-[#F9FCF5] hover:bg-[#DCFAB7]/20 border-transparent text-[#1F3A00]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onTogglePropertySize(ps)}
                      className="w-4 h-4 rounded border-[#99D055] text-[#1F3A00] accent-[#1F3A00] focus:ring-[#99D055] cursor-pointer"
                    />
                    <span className="text-sm truncate">{PROPERTY_SIZE_DEFINITIONS[ps].label}</span>
                  </div>
                  <span className="text-xs text-[#1F3A00]/60 font-mono">({count})</span>
                </label>
              );
            })}
          </div>
        )}
      </fieldset>

      {/* GROUP 4: Urgency / How Soon */}
      <fieldset className="border-t border-[#E5FBC9] pt-5 p-0 m-0 space-y-3">
        <legend className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1F3A00]/80 mb-1 block">
          4. How Soon Do You Need It?
        </legend>
        <div className="grid grid-cols-1 gap-1.5">
          <button
            type="button"
            onClick={() => onSetUrgency(state.urgency === "emergency" ? "all" : "emergency")}
            className={`flex items-center justify-between px-3 py-2 rounded-[12px] border text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              state.urgency === "emergency"
                ? "bg-[#1F3A00] text-white border-[#1F3A00] shadow-2xs"
                : "bg-[#F9FCF5] text-[#1F3A00] border-[#E5FBC9] hover:bg-[#DCFAB7]/40"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B7F56A]" />
              <span>Emergency (Today)</span>
            </div>
            <Zap className="w-4 h-4 text-[#B7F56A]" />
          </button>

          <button
            type="button"
            onClick={() => onSetUrgency(state.urgency === "this-week" ? "all" : "this-week")}
            className={`flex items-center justify-between px-3 py-2 rounded-[12px] border text-sm transition-colors duration-150 cursor-pointer ${
              state.urgency === "this-week"
                ? "bg-[#DCFAB7] text-[#1F3A00] font-semibold border-[#99D055]"
                : "bg-[#F9FCF5] text-[#1F3A00] border-[#E5FBC9] hover:bg-[#DCFAB7]/40"
            }`}
          >
            <span>This Week</span>
          </button>

          <button
            type="button"
            onClick={() => onSetUrgency(state.urgency === "flexible" ? "all" : "flexible")}
            className={`flex items-center justify-between px-3 py-2 rounded-[12px] border text-sm transition-colors duration-150 cursor-pointer ${
              state.urgency === "flexible"
                ? "bg-[#DCFAB7] text-[#1F3A00] font-semibold border-[#99D055]"
                : "bg-[#F9FCF5] text-[#1F3A00] border-[#E5FBC9] hover:bg-[#DCFAB7]/40"
            }`}
          >
            <span>Flexible / Just Browsing</span>
          </button>
        </div>
      </fieldset>

      {/* GROUP 5: London Postcode Coverage Lookup */}
      <fieldset className="border-t border-[#E5FBC9] pt-5 p-0 m-0 space-y-3">
        <legend className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1F3A00]/80 mb-1 block">
          5. London Area Coverage
        </legend>
        <form onSubmit={handlePostcodeSubmit} className="space-y-2">
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 w-4 h-4 text-[#1F3A00]/50" />
            <input
              type="text"
              value={postcodeInput}
              onChange={(e) => setPostcodeInput(e.target.value.toUpperCase())}
              placeholder="e.g. IG1, E14, RM8"
              className="w-full h-10 pl-9 pr-14 text-sm bg-white border border-[#E5FBC9] rounded-[12px] text-[#1F3A00] placeholder:text-[#1F3A00]/40 focus:border-[#1F3A00] focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 px-2.5 py-1 text-xs font-semibold bg-[#B7F56A] text-[#1F3A00] rounded-[8px] hover:opacity-90 cursor-pointer"
            >
              Check
            </button>
          </div>

          {postcodeCoverage && (
            <div
              className={`p-2.5 rounded-[10px] text-xs leading-relaxed flex items-start gap-2 border ${
                postcodeCoverage.status === "AVAILABLE"
                  ? "bg-[#DCFAB7]/60 text-[#1F3A00] border-[#99D055]"
                  : "bg-amber-50 text-amber-900 border-amber-200"
              }`}
            >
              {postcodeCoverage.status === "AVAILABLE" ? (
                <CheckCircle2 className="w-4 h-4 text-[#1F3A00] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              )}
              <span>{postcodeCoverage.message}</span>
            </div>
          )}
          <p className="text-[11px] text-[#1F3A00]/60">
            Covers all 32 London boroughs &amp; M25 border postcodes.
          </p>
        </form>
      </fieldset>

      {/* GROUP 6: Informational Price Note */}
      <div className="border-t border-[#E5FBC9] pt-4">
        <div className="p-3 bg-[#F9FCF5] rounded-[14px] border border-[#E5FBC9] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F3A00]">
            <ShieldCheck className="w-4 h-4 text-[#1F3A00]" />
            <span>Honest Pricing Policy</span>
          </div>
          <p className="text-[12px] text-[#1F3A00]/75 leading-snug">
            Starting prices shown per service — final quote is confirmed before booking, with zero hidden fees.
          </p>
        </div>
      </div>
    </aside>
  );
}
