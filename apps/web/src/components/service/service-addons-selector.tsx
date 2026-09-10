"use client";

import { useState } from "react";
import { Plus, Check, Sparkles } from "lucide-react";
import { SectionReveal } from "@/components/motion";

export interface AddOnOption {
  id: string;
  name: string;
  priceDisplay: string;
  priceAmount?: number;
  description?: string;
}

export interface ServiceAddonsSelectorProps {
  title?: string;
  subtitle?: string;
  addOns: AddOnOption[];
  onAddOnsChange?: (selectedIds: string[], totalPrice: number) => void;
}

export function ServiceAddonsSelector({
  title = "Optional Service Add-ons",
  subtitle = "Enhance your booking with verified property treatment add-ons",
  addOns,
  onAddOnsChange,
}: ServiceAddonsSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  if (!addOns || addOns.length === 0) return null;

  const toggleAddOn = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);

    if (onAddOnsChange) {
      const selectedArray = Array.from(next);
      const totalExtra = addOns
        .filter((a) => next.has(a.id))
        .reduce((sum, item) => sum + (item.priceAmount || 0), 0);
      onAddOnsChange(selectedArray, totalExtra);
    }
  };

  return (
    <SectionReveal className="bg-[#F8F9FA] rounded-[16px] p-6 sm:p-8 border border-[#E5FBC9] space-y-6 text-start">
      <div className="space-y-1 border-b border-[#E5FBC9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-100 border border-[#E5FBC9] text-ink-600 text-xs font-mono font-medium uppercase">
          <Sparkles className="w-3.5 h-3.5 text-ink-600 shrink-0" />
          <span>Optional Add-Ons</span>
        </div>
        <h3 className="font-heading text-2xl font-medium text-ink-900">{title}</h3>
        <p className="text-base text-ink-500 font-normal">{subtitle}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {addOns.map((item) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleAddOn(item.id)}
              className={`p-4 rounded-[16px] border text-start transition-colors duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? "bg-[#1F3A00] border-[#1F3A00] font-medium text-[#B7F56A]"
                  : "bg-white border-[#E5FBC9] hover:bg-[#F9FCF5]"
              }`}
            >
              <div className="space-y-0.5">
                <div className={`font-heading text-base font-medium ${isSelected ? "text-[#B7F56A]" : "text-ink-900"}`}>{item.name}</div>
                {item.description && (
                  <div className={`text-xs font-normal ${isSelected ? "text-[#DFFBBC]" : "text-ink-500"}`}>{item.description}</div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${
                  isSelected ? "bg-[#2d5004] text-[#B7F56A] border-[#3A5C13]" : "bg-[#F9FCF5] text-ink-600 border-[#E5FBC9]"
                }`}>
                  +{item.priceDisplay}
                </span>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors duration-150 ${
                  isSelected ? "bg-[#B7F56A] text-[#1F3A00] border-[#B7F56A]" : "bg-[#F9FCF5] text-ink-600 border-[#E5FBC9]"
                }`}>
                  {isSelected ? <Check className="w-3.5 h-3.5 text-[#1F3A00]" /> : <Plus className="w-3.5 h-3.5 text-ink-600" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </SectionReveal>
  );
}
