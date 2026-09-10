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
      className="px-4 py-2 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] text-[#1F3A00] font-medium text-xs hover:bg-[#DCFAB7] transition-colors duration-150 flex items-center gap-2 shrink-0 cursor-pointer"
    >
      <HugeiconsIcon icon={PrinterIcon} size={14} className="text-[#1F3A00] stroke-[2]" />
      <span>Print / Download Checklist</span>
    </button>
  );
}
