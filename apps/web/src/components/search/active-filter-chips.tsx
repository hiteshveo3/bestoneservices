"use client";

import { X, RotateCcw } from "lucide-react";
import type { ActiveChip } from "@/lib/use-service-filters";

interface ActiveFilterChipsProps {
  chips: ActiveChip[];
  onClearAll: () => void;
  className?: string;
}

export function ActiveFilterChips({
  chips,
  onClearAll,
  className = "",
}: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 pt-1 ${className}`}>
      <span className="text-xs font-semibold text-[#1F3A00]/70 uppercase tracking-wider mr-1">
        Active Filters:
      </span>

      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-[#DCFAB7]/70 border border-[#99D055] text-[#1F3A00] shadow-2xs animate-fadeIn"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="w-4 h-4 rounded-full inline-flex items-center justify-center hover:bg-[#B7F56A] text-[#1F3A00] transition-colors duration-150 cursor-pointer"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {chips.length >= 2 && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1F3A00] hover:underline underline-offset-2 ml-1 cursor-pointer transition-colors duration-150 py-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear all ({chips.length})</span>
        </button>
      )}
    </div>
  );
}
