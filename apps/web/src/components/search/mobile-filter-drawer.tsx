"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { FilterSidebar } from "./filter-sidebar";
import type { FilterState } from "@/lib/use-service-filters";
import type { CoverageCheckResult } from "@/lib/coverage-data";
import type { ServiceCategory, JobType, PropertySize, Urgency } from "@/content/service-directory";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resultCount: number;
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
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  resultCount,
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
}: MobileFilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filter services"
        className="w-full max-w-md bg-white h-full flex flex-col shadow-sm drawer-in text-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5FBC9] bg-[#F9FCF5]">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#1F3A00]">
              Filter Services
            </h2>
            <p className="text-xs text-[#1F3A00]/60">
              Refine by vertical, urgency, size and area
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-[#E5FBC9] text-[#1F3A00] hover:bg-[#B7F56A] transition-colors cursor-pointer"
            aria-label="Close filter drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters Body */}
        <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
          <FilterSidebar
            state={state}
            facetCounts={facetCounts}
            postcodeCoverage={postcodeCoverage}
            isPropertySizeRelevant={isPropertySizeRelevant}
            onToggleCategory={onToggleCategory}
            onToggleJobType={onToggleJobType}
            onTogglePropertySize={onTogglePropertySize}
            onSetUrgency={onSetUrgency}
            onSetPostcode={onSetPostcode}
            onClearAll={onClearAll}
            className="border-0 shadow-none p-0"
          />
        </div>

        {/* Sticky Apply Button Footer */}
        <div className="p-4 border-t border-[#E5FBC9] bg-[#F9FCF5] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 rounded-[14px] bg-[#B7F56A] hover:bg-[#a8eb58] text-[#1F3A00] font-semibold text-base shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>Show {resultCount} {resultCount === 1 ? "Result" : "Results"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
