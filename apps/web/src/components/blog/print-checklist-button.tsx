"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { PrinterIcon } from "@hugeicons/core-free-icons";

export function PrintChecklistButton() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="px-4 py-2 rounded-full bg-[#F6F5F1] border border-[#ECEAE3] text-[#1D201E] font-medium text-xs hover:bg-[#EAF8D6] transition-colors duration-150 flex items-center gap-2 shrink-0 cursor-pointer"
    >
      <HugeiconsIcon icon={PrinterIcon} size={14} className="text-[#1D201E] stroke-[2]" />
      <span>Print / Download Checklist</span>
    </button>
  );
}
