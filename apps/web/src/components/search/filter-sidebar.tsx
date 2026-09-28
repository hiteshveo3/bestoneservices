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
} from "@/components/icons";
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
      className={`w-full bg-white rounded-[20px] p-5 lg:p-6 space-y-6 text-start ${className}`}
      aria-label="Service filters"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-[#ECEAE3] pb-4">
        <h2 className="font-heading text-lg font-[650] text-[#1D201E]">
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
            className="text-xs font-semibold text-[#1D201E]/70 hover:text-[#1D201E] hover:underline cursor-pointer transition-colors duration-150"
          >
            Reset all
          </button>
        )}
      </div>

      {/* GROUP 1: Service Category */}
      <fieldset className="space-y-3 border-0 p-0 m-0">
        <legend className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1D201E]/80 mb-2 block">
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
                className={`flex items-center justify-between px-3 py-2.5 rounded-[14px] transition-colors duration-150 cursor-pointer select-none ${
 isChecked
 ? "bg-[#EAF8D6]/80 font-semibold text-[#1D201E]"
 : "bg-white hover:bg-[#EAF8D6]/30 text-[#1D201E]"
 }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleCategory(cat)}
                    className="w-4 h-4 rounded border-[#ECEAE3] text-[#1D201E] accent-[#1D201E] focus:ring-[#1D201E] cursor-pointer"
                  />
                  <Icon className="w-4 h-4 text-[#1D201E] shrink-0" />
                  <span className="text-sm truncate">{CATEGORY_DEFINITIONS[cat].label}</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-md font-mono ${
 isChecked
 ? "bg-[#B7F56A] text-[#1D201E] font-semibold"
 : "bg-white text-[#1D201E]/70"
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
      <fieldset className="space-y-3 border-[#ECEAE3] pt-5 p-0 m-0">
        <legend className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1D201E]/80 mb-2 block">
          2. Job Type
        </legend>
        <div className="space-y-2">
          {jobTypes.map((jt) => {
            const isChecked = state.jobTypes.includes(jt);
            const count = facetCounts.jobTypes[jt];

            return (
              <label
                key={jt}
                className={`flex items-center justify-between px-3 py-2 rounded-[12px] transition-colors duration-150 cursor-pointer select-none ${
 isChecked
 ? "bg-[#EAF8D6]/60 font-medium text-[#1D201E]"
 : "bg-white hover:bg-[#EAF8D6]/20 border-transparent text-[#1D201E]"
 }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleJobType(jt)}
                    className="w-4 h-4 rounded border-[#ECEAE3] text-[#1D201E] accent-[#1D201E] focus:ring-[#1D201E] cursor-pointer"
                  />
                  <span className="text-sm truncate">{JOB_TYPE_DEFINITIONS[jt].label}</span>
                </div>
                <span className="text-xs text-[#1D201E]/60 font-mono">({count})</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* GROUP 3: Property Type & Size (Smart Conditional Visibility) */}
      <fieldset className=" border-[#ECEAE3] pt-5 p-0 m-0 space-y-3">
        <div className="flex items-center justify-between">
          <legend className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1D201E]/80 block">
            3. Property Size
          </legend>
          {!isPropertySizeRelevant && (
            <button
              type="button"
              onClick={() => setPropertySizeExpanded(!propertySizeExpanded)}
              className="text-[11px] font-semibold text-[#1D201E]/60 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{propertySizeExpanded ? "Hide" : "Show"}</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${propertySizeExpanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>

        {!isPropertySizeRelevant && !propertySizeExpanded ? (
          <p className="text-xs text-[#1D201E]/60 bg-white p-2.5 rounded-md ">
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
                  className={`flex items-center justify-between px-3 py-2 rounded-[12px] transition-colors duration-150 cursor-pointer select-none ${
 isChecked
 ? "bg-[#EAF8D6]/60 font-medium text-[#1D201E]"
 : "bg-white hover:bg-[#EAF8D6]/20 border-transparent text-[#1D201E]"
 }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onTogglePropertySize(ps)}
                      className="w-4 h-4 rounded border-[#ECEAE3] text-[#1D201E] accent-[#1D201E] focus:ring-[#1D201E] cursor-pointer"
                    />
                    <span className="text-sm truncate">{PROPERTY_SIZE_DEFINITIONS[ps].label}</span>
                  </div>
                  <span className="text-xs text-[#1D201E]/60 font-mono">({count})</span>
                </label>
              );
            })}
          </div>
        )}
      </fieldset>

      {/* GROUP 4: Urgency / How Soon */}
      <fieldset className=" border-[#ECEAE3] pt-5 p-0 m-0 space-y-3">
        <legend className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1D201E]/80 mb-1 block">
          4. How Soon Do You Need It?
        </legend>
        <div className="grid grid-cols-1 gap-1.5">
          <button
            type="button"
            onClick={() => onSetUrgency(state.urgency === "emergency" ? "all" : "emergency")}
            className={`flex items-center justify-between px-3 py-2 rounded-[12px] text-sm font-semibold transition-colors duration-150 cursor-pointer ${
 state.urgency === "emergency"
 ? "bg-[#B7F56A] text-[#1D201E] border-[#1D201E] "
 : "bg-white text-[#1D201E] hover:bg-[#EAF8D6]/40"
 }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B7F56A]" />
              <span>Emergency (Today)</span>
            </div>
            <Zap className="w-4 h-4 text-[#1D201E]" />
          </button>

          <button
            type="button"
            onClick={() => onSetUrgency(state.urgency === "this-week" ? "all" : "this-week")}
            className={`flex items-center justify-between px-3 py-2 rounded-[12px] text-sm transition-colors duration-150 cursor-pointer ${
 state.urgency === "this-week"
 ? "bg-[#EAF8D6] text-[#1D201E] font-semibold "
 : "bg-white text-[#1D201E] hover:bg-[#EAF8D6]/40"
 }`}
          >
            <span>This Week</span>
          </button>

          <button
            type="button"
            onClick={() => onSetUrgency(state.urgency === "flexible" ? "all" : "flexible")}
            className={`flex items-center justify-between px-3 py-2 rounded-[12px] text-sm transition-colors duration-150 cursor-pointer ${
 state.urgency === "flexible"
 ? "bg-[#EAF8D6] text-[#1D201E] font-semibold "
 : "bg-white text-[#1D201E] hover:bg-[#EAF8D6]/40"
 }`}
          >
            <span>Flexible / Just Browsing</span>
          </button>
        </div>
      </fieldset>

      {/* GROUP 5: London Postcode Coverage Lookup */}
      <fieldset className=" border-[#ECEAE3] pt-5 p-0 m-0 space-y-3">
        <legend className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1D201E]/80 mb-1 block">
          5. London Area Coverage
        </legend>
        <form onSubmit={handlePostcodeSubmit} className="space-y-2">
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 w-4 h-4 text-[#1D201E]/50" />
            <input
              type="text"
              value={postcodeInput}
              onChange={(e) => setPostcodeInput(e.target.value.toUpperCase())}
              placeholder="e.g. IG1, E14, RM8"
              className="w-full h-10 pl-9 pr-14 text-sm bg-white border border-[#ECEAE3] rounded-[12px] text-[#1D201E] placeholder:text-[#1D201E]/40 focus:border-[#1D201E] focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 px-2.5 py-1 text-xs font-semibold bg-[#B7F56A] text-[#1D201E] rounded-[8px] hover:opacity-90 cursor-pointer"
            >
              Check
            </button>
          </div>

          {postcodeCoverage && (
            <div
              className={`p-2.5 rounded-[10px] text-xs leading-relaxed flex items-start gap-2 ${
 postcodeCoverage.status === "AVAILABLE"
 ? "bg-[#EAF8D6]/60 text-[#1D201E] "
 : "bg-amber-50 text-amber-900 border-amber-200"
 }`}
            >
              {postcodeCoverage.status === "AVAILABLE" ? (
                <CheckCircle2 className="w-4 h-4 text-[#1D201E] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              )}
              <span>{postcodeCoverage.message}</span>
            </div>
          )}
          <p className="text-[11px] text-[#1D201E]/60">
            Covers all 32 London boroughs &amp; M25 border postcodes.
          </p>
        </form>
      </fieldset>

      {/* GROUP 6: Informational Price Note */}
      <div className=" border-[#ECEAE3] pt-4">
        <div className="p-3 bg-white rounded-[14px] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1D201E]">
            <ShieldCheck className="w-4 h-4 text-[#1D201E]" />
            <span>Honest Pricing Policy</span>
          </div>
          <p className="text-[12px] text-[#1D201E]/75 leading-snug">
            Starting prices shown per service — final quote is confirmed before booking, with zero hidden fees.
          </p>
        </div>
      </div>
    </aside>
  );
}
