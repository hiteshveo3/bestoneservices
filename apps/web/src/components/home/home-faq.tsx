"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

export interface HomeFaqItem {
  q: string;
  a: string;
}

/**
 * FAQ accordion using the exact Clean Editorial treatment from the service
 * page (MintLimeServiceLayout, section 9): one bordered white card, hairline
 * dividers, lime chevron chip on the open row.
 */
export function HomeFaq({ items }: { items: readonly HomeFaqItem[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div
      id="faqs"
      className="border border-[#E5FBC9] rounded-[20px] bg-white overflow-hidden divide-y divide-[#E5FBC9] shadow-2xs"
    >
      {items.map((faq, idx) => {
        const isOpen = openFaq === idx;
        const panelId = `home-faq-panel-${idx}`;
        const triggerId = `home-faq-trigger-${idx}`;

        return (
          <div key={idx} className="transition-colors duration-150">
            <button
              id={triggerId}
              type="button"
              onClick={() => setOpenFaq(isOpen ? null : idx)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-base sm:text-lg text-[#1F3A00] transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1F3A00]"
            >
              <span>{faq.q}</span>
              <span
                aria-hidden="true"
                data-open={isOpen}
                className={`accordion-chevron w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[#1F3A00] transition-colors duration-200 ${
                  isOpen ? "bg-[#B7F56A]" : ""
                }`}
              >
                <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={2} className="text-[#1F3A00]" />
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="accordion-panel"
              data-open={isOpen}
            >
              <div>
                <p className="m-0 px-5 pb-5 text-sm sm:text-base leading-relaxed text-[#1F3A00]">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
