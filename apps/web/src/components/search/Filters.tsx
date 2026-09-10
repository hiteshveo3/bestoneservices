"use client";

import { useEffect, useId, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChevronDownIcon,
  Cancel01Icon,
  FilterIcon,
  Tick01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import {
  type ServiceCategory,
  type JobType,
  type PropertySize,
  type Urgency,
  CATEGORY_DEFINITIONS,
  JOB_TYPE_DEFINITIONS,
  PROPERTY_SIZE_DEFINITIONS,
} from "@/content/service-directory";
import type { FilterState } from "@/lib/filter-matcher";
import type { CoverageCheckResult } from "@/lib/coverage-data";

/* --- 1. Dropdown Shell ---------------------------------------------------- */

export function Dropdown({
  label,
  summary,
  active,
  children,
  widthClass = "w-72",
}: {
  label: string;
  summary: string;
  active: boolean;
  children: React.ReactNode;
  widthClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-9 items-center justify-between gap-2 rounded-[9px] border px-3 text-xs font-semibold transition-all duration-150 cursor-pointer shadow-2xs shrink-0 ${
          active
            ? "border-[#1F3A00] bg-[#1F3A00] text-white"
            : "border-[#E5FBC9] bg-white text-[#1F3A00]/80 hover:border-[#B7F56A] hover:bg-[#F9FCF5]"
        }`}
      >
        <span className="truncate">{summary}</span>
        <HugeiconsIcon
          icon={ChevronDownIcon}
          size={14}
          strokeWidth={2}
          className={`shrink-0 transition-transform duration-200 ${
            active ? "text-[#B7F56A]" : "text-[#1F3A00]/60"
          } ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id={id}
          role="region"
          aria-label={label}
          className={`absolute left-0 top-[calc(100%+6px)] z-40 max-h-96 overflow-y-auto overflow-x-hidden rounded-[12px] border border-[#E5FBC9] bg-white p-3.5 shadow-xl animate-in fade-in-50 duration-150 ${widthClass}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* --- 2. Modern Custom Checkbox & Radio Controls --------------------------- */

export function ModernCheckbox({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
}) {
  return (
    <span className="relative inline-flex items-center justify-center shrink-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        className="sr-only peer"
      />
      <span
        aria-hidden="true"
        className={`w-4 h-4 rounded-[5px] border flex items-center justify-center transition-all duration-150 cursor-pointer ${
          checked
            ? "bg-[#1F3A00] border-[#1F3A00] text-[#B7F56A] shadow-xs"
            : "border-[#1F3A00]/25 bg-white group-hover:border-[#1F3A00]/50"
        }`}
      >
        {checked && (
          <HugeiconsIcon
            icon={Tick01Icon}
            size={11}
            strokeWidth={3.5}
            className="text-[#B7F56A] animate-in zoom-in-50 duration-100"
          />
        )}
      </span>
    </span>
  );
}

export function ModernRadio({
  checked,
  onChange,
  name,
  ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  name?: string;
  ariaLabel?: string;
}) {
  return (
    <span className="relative inline-flex items-center justify-center shrink-0">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        className="sr-only peer"
      />
      <span
        aria-hidden="true"
        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-150 cursor-pointer ${
          checked
            ? "bg-[#1F3A00] border-[#1F3A00] text-[#B7F56A] shadow-xs"
            : "border-[#1F3A00]/25 bg-white group-hover:border-[#1F3A00]/50"
        }`}
      >
        {checked && (
          <HugeiconsIcon
            icon={Tick01Icon}
            size={10}
            strokeWidth={3.5}
            className="text-[#B7F56A] animate-in zoom-in-50 duration-100"
          />
        )}
      </span>
    </span>
  );
}

/* --- 3. Checkbox Facet Lists ---------------------------------------------- */

export function CategoryFacetList({
  selected,
  onToggle,
  counts,
}: {
  selected: ServiceCategory[];
  onToggle: (cat: ServiceCategory) => void;
  counts?: Record<ServiceCategory, number>;
}) {
  const categories: ServiceCategory[] = ["cleaning", "pest-control", "gardening", "removals"];

  return (
    <fieldset className="space-y-1">
      <legend className="sr-only">Service Category</legend>
      {categories.map((cat) => {
        const checked = selected.includes(cat);
        const count = counts?.[cat] ?? 0;
        return (
          <label
            key={cat}
            className={`group flex cursor-pointer items-center justify-between gap-2.5 rounded-[8px] px-2.5 py-2 text-sm transition-colors ${
              checked
                ? "bg-[#DCFAB7]/50 text-[#1F3A00] font-semibold"
                : "text-[#1F3A00]/80 hover:bg-[#F9FCF5]"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <ModernCheckbox
                checked={checked}
                onChange={() => onToggle(cat)}
                ariaLabel={CATEGORY_DEFINITIONS[cat].label}
              />
              <span className="truncate">{CATEGORY_DEFINITIONS[cat].label}</span>
            </div>
            {count !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono shrink-0 ${
                  checked ? "bg-[#B7F56A] text-[#1F3A00]" : "bg-[#DCFAB7]/40 text-[#1F3A00]/60"
                }`}
              >
                {count}
              </span>
            )}
          </label>
        );
      })}
    </fieldset>
  );
}

export const SHORT_JOB_TYPE_LABELS: Record<JobType, string> = {
  "one-off": "One-Off",
  "recurring": "Recurring",
  "inspection": "Inspection",
  "emergency": "Emergency",
};

export function JobTypeFacetList({
  selected,
  onToggle,
  counts,
}: {
  selected: JobType[];
  onToggle: (jobType: JobType) => void;
  counts?: Record<JobType, number>;
}) {
  const jobTypes: JobType[] = ["one-off", "recurring", "inspection", "emergency"];

  return (
    <fieldset className="space-y-1">
      <legend className="sr-only">Job Type</legend>
      {jobTypes.map((jt) => {
        const checked = selected.includes(jt);
        const count = counts?.[jt] ?? 0;
        return (
          <label
            key={jt}
            className={`group flex cursor-pointer items-center justify-between gap-2.5 rounded-[8px] px-2.5 py-2 text-sm transition-colors ${
              checked
                ? "bg-[#DCFAB7]/50 text-[#1F3A00] font-semibold"
                : "text-[#1F3A00]/80 hover:bg-[#F9FCF5]"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <ModernCheckbox
                checked={checked}
                onChange={() => onToggle(jt)}
                ariaLabel={SHORT_JOB_TYPE_LABELS[jt]}
              />
              <span className="truncate">{SHORT_JOB_TYPE_LABELS[jt]}</span>
            </div>
            {count !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono shrink-0 ${
                  checked ? "bg-[#B7F56A] text-[#1F3A00]" : "bg-[#DCFAB7]/40 text-[#1F3A00]/60"
                }`}
              >
                {count}
              </span>
            )}
          </label>
        );
      })}
    </fieldset>
  );
}

export function PropertySizeFacetList({
  selected,
  onToggle,
  counts,
  isRelevant = true,
}: {
  selected: PropertySize[];
  onToggle: (size: PropertySize) => void;
  counts?: Record<PropertySize, number>;
  isRelevant?: boolean;
}) {
  const sizes: PropertySize[] = ["studio", "1-bed", "2-bed", "3-bed", "4-plus", "commercial"];

  return (
    <div>
      {!isRelevant && (
        <p className="mb-2.5 text-xs text-[#1F3A00]/60 italic">
          Property size filters apply primarily to cleaning & removals jobs.
        </p>
      )}
      <fieldset className="space-y-1">
        <legend className="sr-only">Property Size</legend>
        {sizes.map((sz) => {
          const checked = selected.includes(sz);
          const count = counts?.[sz] ?? 0;
          return (
            <label
              key={sz}
              className={`group flex cursor-pointer items-center justify-between gap-2.5 rounded-[8px] px-2.5 py-2 text-sm transition-colors ${
                checked
                  ? "bg-[#DCFAB7]/50 text-[#1F3A00] font-semibold"
                : "text-[#1F3A00]/80 hover:bg-[#F9FCF5]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ModernCheckbox
                  checked={checked}
                  onChange={() => onToggle(sz)}
                  ariaLabel={PROPERTY_SIZE_DEFINITIONS[sz].label}
                />
                <span className="truncate">{PROPERTY_SIZE_DEFINITIONS[sz].label}</span>
              </div>
              {count !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono shrink-0 ${
                    checked ? "bg-[#B7F56A] text-[#1F3A00]" : "bg-[#DCFAB7]/40 text-[#1F3A00]/60"
                  }`}
                >
                  {count}
                </span>
              )}
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}

/* --- 4. Urgency / Dispatch Facet ------------------------------------------ */

export function UrgencyFacetList({
  selected,
  onChange,
}: {
  selected: Urgency | "all";
  onChange: (u: Urgency | "all") => void;
}) {
  const options: { value: Urgency | "all"; label: string; badge?: string }[] = [
    { value: "all", label: "Any time" },
    { value: "emergency", label: "Urgent", badge: "⚡ 90 min" },
    { value: "this-week", label: "This week" },
    { value: "flexible", label: "Flexible" },
  ];

  return (
    <fieldset className="space-y-1">
      <legend className="sr-only">Urgency & Timeline</legend>
      {options.map((opt) => {
        const checked = selected === opt.value;
        return (
          <label
            key={opt.value}
            className={`group flex cursor-pointer items-center justify-between gap-2.5 rounded-[8px] px-2.5 py-2 text-sm transition-colors ${
              checked
                ? "bg-[#DCFAB7]/60 text-[#1F3A00] font-semibold"
                : "text-[#1F3A00]/80 hover:bg-[#F9FCF5]"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <ModernRadio
                checked={checked}
                onChange={() => onChange(opt.value)}
                name="urgency-option"
                ariaLabel={opt.label}
              />
              <span className="truncate">{opt.label}</span>
            </div>
            {opt.badge && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#B7F56A] text-[#1F3A00] whitespace-nowrap shrink-0">
                {opt.badge}
              </span>
            )}
          </label>
        );
      })}
    </fieldset>
  );
}

/* --- 5. Postcode / Coverage Facet ----------------------------------------- */

export function PostcodeFacetField({
  postcode,
  coverage,
  onChange,
}: {
  postcode: string;
  coverage: CoverageCheckResult | null;
  onChange: (val: string) => void;
}) {
  const isAvailable = coverage?.status === "AVAILABLE";

  return (
    <div className="space-y-3">
      <div className="relative">
        <HugeiconsIcon
          icon={Location01Icon}
          size={16}
          strokeWidth={1.8}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#1F3A00]/60"
        />
        <input
          type="text"
          value={postcode}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. SW1, NW3, E14"
          className="w-full h-10 pl-9 pr-3 rounded-[8px] border border-[#E5FBC9] bg-[#F9FCF5] text-sm text-[#1F3A00] placeholder:text-[#1F3A00]/40 uppercase focus:bg-white focus:border-[#B7F56A] focus:ring-1 focus:ring-[#B7F56A] focus:outline-none transition-colors"
        />
      </div>

      {postcode.trim() && coverage && (
        <div
          className={`p-2.5 rounded-[8px] text-xs space-y-1 ${
            isAvailable
              ? "bg-[#DCFAB7]/50 text-[#1F3A00] border border-[#B7F56A]/60"
              : "bg-amber-50 text-amber-900 border border-amber-200"
          }`}
        >
          <div className="flex items-center gap-1.5 font-semibold">
            {isAvailable ? (
              <>
                <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={2.4} className="text-[#1F3A00] shrink-0" />
                <span>Coverage Confirmed ({coverage.outcode || coverage.postcode})</span>
              </>
            ) : (
              <span>Outside Primary Zone ({coverage.outcode || coverage.postcode})</span>
            )}
          </div>
          <p className="text-[#1F3A00]/80 leading-relaxed">{coverage.message}</p>
        </div>
      )}
    </div>
  );
}

/* --- 5. Desktop Filter Bar ------------------------------------------------ */

export function FilterBar({
  filters,
  facetCounts,
  postcodeCoverage,
  isPropertySizeRelevant,
  onToggleCategory,
  onToggleJobType,
  onTogglePropertySize,
  onSetUrgency,
  onSetPostcode,
  onOpenDrawer,
  activeCount,
}: {
  filters: FilterState;
  facetCounts: {
    categories: Record<ServiceCategory, number>;
    jobTypes: Record<JobType, number>;
    propertySizes: Record<PropertySize, number>;
  };
  postcodeCoverage: CoverageCheckResult | null;
  isPropertySizeRelevant: boolean;
  onToggleCategory: (c: ServiceCategory) => void;
  onToggleJobType: (j: JobType) => void;
  onTogglePropertySize: (p: PropertySize) => void;
  onSetUrgency: (u: Urgency | "all") => void;
  onSetPostcode: (pc: string) => void;
  onOpenDrawer: () => void;
  activeCount: number;
}) {
  // Category summary
  const categorySummary =
    filters.categories.length === 0
      ? "All Verticals"
      : filters.categories.length === 1
        ? CATEGORY_DEFINITIONS[filters.categories[0]].label
        : `Verticals (${filters.categories.length})`;

  // Job type summary
  const jobSummary =
    filters.jobTypes.length === 0
      ? "Job Type"
      : filters.jobTypes.length === 1
        ? JOB_TYPE_DEFINITIONS[filters.jobTypes[0]].label
        : `Jobs (${filters.jobTypes.length})`;

  // Property size summary
  const sizeSummary =
    filters.propertySizes.length === 0
      ? "Property Size"
      : filters.propertySizes.length === 1
        ? PROPERTY_SIZE_DEFINITIONS[filters.propertySizes[0]].label
        : `Sizes (${filters.propertySizes.length})`;

  // Urgency summary
  const urgencySummary =
    filters.urgency === "all"
      ? "Urgency"
      : filters.urgency === "emergency"
        ? "⚡ Emergency"
        : filters.urgency === "this-week"
          ? "This Week"
          : "Flexible";

  // Postcode summary
  const postcodeSummary = filters.postcode.trim()
    ? `Area: ${filters.postcode.trim().toUpperCase()}`
    : "London Area";

  return (
    <div className="hidden lg:flex flex-wrap items-center gap-2">
      {/* 1. Category Dropdown */}
      <Dropdown
        label="Service Category"
        summary={categorySummary}
        active={filters.categories.length > 0}
        widthClass="w-64"
      >
        <CategoryFacetList
          selected={filters.categories}
          onToggle={onToggleCategory}
          counts={facetCounts.categories}
        />
      </Dropdown>

      {/* 2. Job Type Dropdown */}
      <Dropdown
        label="Job Type"
        summary={jobSummary}
        active={filters.jobTypes.length > 0}
        widthClass="w-72"
      >
        <JobTypeFacetList
          selected={filters.jobTypes}
          onToggle={onToggleJobType}
          counts={facetCounts.jobTypes}
        />
      </Dropdown>

      {/* 3. Property Size Dropdown */}
      <Dropdown
        label="Property Size"
        summary={sizeSummary}
        active={filters.propertySizes.length > 0}
        widthClass="w-72"
      >
        <PropertySizeFacetList
          selected={filters.propertySizes}
          onToggle={onTogglePropertySize}
          counts={facetCounts.propertySizes}
          isRelevant={isPropertySizeRelevant}
        />
      </Dropdown>

      {/* 4. Urgency Dropdown */}
      <Dropdown
        label="Urgency & Timeline"
        summary={urgencySummary}
        active={filters.urgency !== "all"}
        widthClass="w-64"
      >
        <UrgencyFacetList selected={filters.urgency} onChange={onSetUrgency} />
      </Dropdown>

      {/* 5. Postcode Dropdown */}
      <Dropdown
        label="Postcode Coverage"
        summary={postcodeSummary}
        active={Boolean(filters.postcode.trim())}
        widthClass="w-72"
      >
        <PostcodeFacetField
          postcode={filters.postcode}
          coverage={postcodeCoverage}
          onChange={onSetPostcode}
        />
      </Dropdown>

      {/* 6. Outlined All Filters Drawer Trigger Button */}
      <button
        type="button"
        onClick={onOpenDrawer}
        className="h-9 px-3 rounded-[9px] border border-[#E5FBC9] bg-white hover:border-[#B7F56A] hover:bg-[#F9FCF5] text-[#1F3A00] font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
      >
        <HugeiconsIcon icon={FilterIcon} size={13} strokeWidth={2} />
        <span>All Filters</span>
        {activeCount > 0 && (
          <span className="inline-flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#1F3A00] text-[#B7F56A] text-[10px] font-bold font-mono">
            {activeCount}
          </span>
        )}
      </button>
    </div>
  );
}

/* --- 6. Active Filter Chips ----------------------------------------------- */

export function ActiveFilters({
  filters,
  onRemoveCategory,
  onRemoveJobType,
  onRemovePropertySize,
  onClearUrgency,
  onClearPostcode,
  onClearAll,
}: {
  filters: FilterState;
  onRemoveCategory: (c: ServiceCategory) => void;
  onRemoveJobType: (j: JobType) => void;
  onRemovePropertySize: (p: PropertySize) => void;
  onClearUrgency: () => void;
  onClearPostcode: () => void;
  onClearAll: () => void;
}) {
  const chips: { id: string; label: string; onRemove: () => void }[] = [];

  // Categories
  filters.categories.forEach((cat) => {
    chips.push({
      id: `cat-${cat}`,
      label: CATEGORY_DEFINITIONS[cat].label,
      onRemove: () => onRemoveCategory(cat),
    });
  });

  // Job Types
  filters.jobTypes.forEach((jt) => {
    chips.push({
      id: `jt-${jt}`,
      label: SHORT_JOB_TYPE_LABELS[jt] ?? JOB_TYPE_DEFINITIONS[jt].label,
      onRemove: () => onRemoveJobType(jt),
    });
  });

  // Property Sizes
  filters.propertySizes.forEach((sz) => {
    chips.push({
      id: `sz-${sz}`,
      label: PROPERTY_SIZE_DEFINITIONS[sz].label,
      onRemove: () => onRemovePropertySize(sz),
    });
  });

  // Urgency
  if (filters.urgency !== "all") {
    chips.push({
      id: "urgency",
      label: filters.urgency === "emergency" ? "⚡ Emergency" : filters.urgency === "this-week" ? "This Week" : "Flexible",
      onRemove: onClearUrgency,
    });
  }

  // Postcode
  if (filters.postcode.trim()) {
    chips.push({
      id: "postcode",
      label: `Area: ${filters.postcode.trim().toUpperCase()}`,
      onRemove: onClearPostcode,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap py-1 text-start"
      role="region"
      aria-label="Active filters"
    >
      <span className="text-xs font-semibold text-[#1F3A00]/60 shrink-0">Filtering by:</span>
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[#DCFAB7]/70 hover:bg-[#B7F56A] pl-3 pr-2 text-xs font-semibold text-[#1F3A00] transition-colors cursor-pointer shrink-0 border border-[#B7F56A]/60 shadow-2xs"
        >
          <span>{chip.label}</span>
          <HugeiconsIcon icon={Cancel01Icon} size={13} strokeWidth={2.4} className="text-[#1F3A00]/70 hover:text-[#1F3A00]" />
        </button>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-bold text-[#1F3A00] underline underline-offset-4 hover:text-[#1F3A00]/70 cursor-pointer shrink-0 px-2"
      >
        Clear all
      </button>
    </div>
  );
}

/* --- 7. Sort Control (Custom Designed Selector) --------------------------- */

export function SortControl({
  value,
  onChange,
}: {
  value: "relevance" | "popular" | "alpha";
  onChange: (sort: "relevance" | "popular" | "alpha") => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: { value: "relevance" | "popular" | "alpha"; label: string }[] = [
    { value: "relevance", label: "Most Relevant" },
    { value: "popular", label: "Popular First" },
    { value: "alpha", label: "Alphabetical (A–Z)" },
  ];

  const currentLabel = options.find((o) => o.value === value)?.label ?? "Most Relevant";

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative flex items-center gap-2">
      <span className="text-xs font-medium text-[#1F3A00]/70 shrink-0">
        Sort:
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="h-10 px-3.5 rounded-[10px] border-2 border-[#B7F56A] bg-white text-xs font-semibold text-[#1F3A00] flex items-center gap-2 shadow-2xs hover:bg-[#F9FCF5] focus:outline-none focus:ring-2 focus:ring-[#B7F56A]/40 cursor-pointer transition-colors"
      >
        <span>{currentLabel}</span>
        <HugeiconsIcon
          icon={ChevronDownIcon}
          size={14}
          strokeWidth={2}
          className={`text-[#1F3A00]/70 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[170px] bg-white rounded-[12px] border-2 border-[#B7F56A] shadow-xl p-1 animate-in fade-in-50 duration-150"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-xs font-semibold rounded-[8px] flex items-center justify-between text-start cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-[#DCFAB7] text-[#1F3A00] font-bold"
                    : "text-[#1F3A00]/80 hover:bg-[#F9FCF5] hover:text-[#1F3A00]"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    size={14}
                    strokeWidth={2.4}
                    className="text-[#1F3A00] ml-2 shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* --- 8. Mobile Filter Bar ------------------------------------------------- */

export function MobileFilterBar({
  onOpen,
  activeCount,
  sort,
  onSort,
}: {
  onOpen: () => void;
  activeCount: number;
  sort: "relevance" | "popular" | "alpha";
  onSort: (val: "relevance" | "popular" | "alpha") => void;
}) {
  return (
    <div className="lg:hidden flex items-center justify-between gap-3 pt-2">
      <button
        type="button"
        onClick={onOpen}
        className="flex-1 h-11 rounded-[10px] bg-white border-2 border-[#B7F56A] hover:bg-[#F9FCF5] text-[#1F3A00] font-semibold text-sm flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
      >
        <HugeiconsIcon icon={FilterIcon} size={15} strokeWidth={2} />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-[#1F3A00] text-white text-xs font-bold inline-flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      <SortControl value={sort} onChange={onSort} />
    </div>
  );
}

/* --- 9. Full Filter Drawer (Slide-Over) ------------------------------------ */

export function FilterDrawer({
  open,
  onClose,
  filters,
  facetCounts,
  postcodeCoverage,
  isPropertySizeRelevant,
  onToggleCategory,
  onToggleJobType,
  onTogglePropertySize,
  onSetUrgency,
  onSetPostcode,
  onClearAll,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  facetCounts: {
    categories: Record<ServiceCategory, number>;
    jobTypes: Record<JobType, number>;
    propertySizes: Record<PropertySize, number>;
  };
  postcodeCoverage: CoverageCheckResult | null;
  isPropertySizeRelevant: boolean;
  onToggleCategory: (c: ServiceCategory) => void;
  onToggleJobType: (j: JobType) => void;
  onTogglePropertySize: (p: PropertySize) => void;
  onSetUrgency: (u: Urgency | "all") => void;
  onSetPostcode: (pc: string) => void;
  onClearAll: () => void;
  resultCount: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Body scroll lock and Esc key handling
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-200 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      {/* Dark Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#1F3A00]/40 backdrop-blur-xs cursor-pointer"
      />

      {/* Slide-over Drawer Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Service Filters"
        className={`absolute inset-y-0 right-0 w-full max-w-md bg-[#F9FCF5] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out text-start ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E5FBC9] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <HugeiconsIcon icon={FilterIcon} size={18} strokeWidth={2} className="text-[#1F3A00]" />
            <h2 className="font-heading text-lg font-bold text-[#1F3A00]">Filter Services</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#1F3A00]/60 hover:text-[#1F3A00] hover:bg-[#F9FCF5] transition-colors cursor-pointer"
            aria-label="Close filters drawer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable Facets Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Verticals */}
          <div className="space-y-3 pb-5 border-b border-[#E5FBC9]">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1F3A00]">
              Service Vertical
            </h3>
            <CategoryFacetList
              selected={filters.categories}
              onToggle={onToggleCategory}
              counts={facetCounts.categories}
            />
          </div>

          {/* Section 2: Job Types */}
          <div className="space-y-3 pb-5 border-b border-[#E5FBC9]">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1F3A00]">
              Job Type
            </h3>
            <JobTypeFacetList
              selected={filters.jobTypes}
              onToggle={onToggleJobType}
              counts={facetCounts.jobTypes}
            />
          </div>

          {/* Section 3: Property Sizes */}
          <div className="space-y-3 pb-5 border-b border-[#E5FBC9]">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1F3A00]">
              Property Size
            </h3>
            <PropertySizeFacetList
              selected={filters.propertySizes}
              onToggle={onTogglePropertySize}
              counts={facetCounts.propertySizes}
              isRelevant={isPropertySizeRelevant}
            />
          </div>

          {/* Section 4: Urgency */}
          <div className="space-y-3 pb-5 border-b border-[#E5FBC9]">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1F3A00]">
              Urgency & Timeline
            </h3>
            <UrgencyFacetList selected={filters.urgency} onChange={onSetUrgency} />
          </div>

          {/* Section 5: London Postcode Coverage */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1F3A00]">
              London Postcode Coverage
            </h3>
            <PostcodeFacetField
              postcode={filters.postcode}
              coverage={postcodeCoverage}
              onChange={onSetPostcode}
            />
          </div>
        </div>

        {/* Sticky Drawer Footer */}
        <div className="p-4 border-t border-[#E5FBC9] bg-white flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClearAll}
            className="px-4 py-3 rounded-[10px] border border-[#E5FBC9] text-xs font-bold text-[#1F3A00] hover:bg-[#F9FCF5] transition-colors"
          >
            Reset All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-[10px] bg-[#B7F56A] hover:bg-[#a8eb58] text-[#1F3A00] font-bold text-sm shadow-2xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Show {resultCount} {resultCount === 1 ? "Service" : "Services"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
