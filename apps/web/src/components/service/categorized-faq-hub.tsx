"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { SectionReveal } from "@/components/motion";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: "pricing" | "included" | "treatments" | "guarantee";
}

export interface CategorizedFaqHubProps {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
  showCategoryTabs?: boolean;
}

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "pricing", label: "Pricing & Rates" },
  { id: "included", label: "What's Included" },
  { id: "treatments", label: "Treatments & Booking" },
  { id: "guarantee", label: "Guarantees & Policies" },
];

export function CategorizedFaqHub({
  title = "Frequently Asked Questions",
  subtitle = "Clear answers about scope, pricing, equipment, and service commitments",
  items,
  showCategoryTabs = items.length >= 8,
}: CategorizedFaqHubProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  if (!items || items.length === 0) return null;

  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter((item) => item.category === selectedCategory);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SectionReveal className="bg-[#F9FCF5] rounded-[16px] p-6 sm:p-10 border border-[#B7F56A] space-y-6 text-start">
      <div className="space-y-1 border-b border-[#E5FBC9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium uppercase">
          <HelpCircle className="w-3.5 h-3.5 text-white shrink-0" />
          <span>HELP & CLARIFICATIONS</span>
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">{title}</h3>
        <p className="text-base text-ink-500">{subtitle}</p>
      </div>

      {/* CATEGORY TABS (Only shown when 8+ FAQs exist) */}
      {showCategoryTabs && (
        <div className="flex gap-2 overflow-x-auto snap-x custom-scrollbar pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 sm:flex-wrap">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`snap-start px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap border ${ isSelected ? "bg-[#1F3A00] text-white border-ink-900 font-medium " : "bg-[#F9FCF5] text-[#1F3A00] border-[#E5FBC9] hover:bg-[#DCFAB7]" }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ACCORDION LIST */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isOpen = !!openItems[item.id];
          return (
            <div
              key={item.id}
              id={item.id}
              className="rounded-[16px] bg-[#F9FCF5] border border-[#E5FBC9] overflow-hidden transition-colors duration-150"
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                className="w-full p-4 sm:p-5 flex items-center justify-between font-heading font-medium text-base sm:text-lg text-ink-900 text-start cursor-pointer focus:outline-none"
              >
                <span>{item.question}</span>
                <ChevronDown className={`w-5 h-5 text-ink-600 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[#E5FBC9] text-base text-ink-500 leading-relaxed font-normal">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionReveal>
  );
}
