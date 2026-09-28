"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  id?: number | string;
  q: string;
  a: string;
}

export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  return (
    <div className="space-y-4 text-start" id="faqs">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const slugId = item.id ? String(item.id) : `faq-item-${idx + 1}`;
        const contentId = `faq-content-${idx + 1}`;
        const triggerId = `faq-trigger-${idx + 1}`;

        return (
          <div 
            key={idx}
            id={slugId} 
            className="bg-[#F6F5F1] rounded-[16px] border border-[#ECEAE3] overflow-hidden transition-colors duration-200 scroll-mt-24 "
          >
            <button 
              type="button"
              id={triggerId}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full p-6 flex items-center justify-between gap-4 text-start cursor-pointer group focus:outline-none"
              aria-expanded={isOpen}
              aria-controls={contentId}
            >
              <div className="flex items-center gap-3">
                <span className="font-heading font-bold text-lg sm:text-xl text-[#1D201E]">
                  {item.q}
                </span>
              </div>
              <div 
                data-open={isOpen}
                className={`accordion-chevron w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-[#ECEAE3] text-[#1D201E] transition-colors duration-200 ease-in-out ${
                  isOpen ? "bg-[#B7F56A]" : "bg-[#EAF8D6]"
                }`}
                aria-hidden="true"
              >
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>

            <div
              id={contentId}
              role="region"
              aria-labelledby={triggerId}
              className="accordion-panel"
              data-open={isOpen}
            >
              <div>
                <div className="px-6 pb-6 pt-2">
                  <div className="pt-4 border-t border-[#ECEAE3] text-[#1D201E] text-base leading-relaxed">
                    <p className="text-base text-[#1D201E]/75 leading-relaxed font-normal">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}



