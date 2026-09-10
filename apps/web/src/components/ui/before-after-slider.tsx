"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";

export function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="relative h-[360px] sm:h-[460px] rounded-[24px] overflow-hidden border border-[#E5FBC9] shadow-2xs select-none">
      {/* AFTER Image (Full background layer) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/tenancy-kitchen-after-v1.png"
          alt="After: Deep Cleaned Property Result"
          width={1200}
          height={800}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-4 right-4 z-10">
          <span className="px-4 py-1.5 rounded-full bg-[#F9FCF5]/95 text-ink-700 text-xs font-mono font-semibold uppercase tracking-wider border border-[#B7F56A] shadow-2xs whitespace-nowrap inline-block">
            AFTER
          </span>
        </div>
      </div>

      {/* BEFORE Image (Clipped overlay layer) */}
      <div 
        className="absolute inset-y-0 left-0 overflow-hidden z-15" 
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="absolute inset-y-0 left-0 w-full h-full" style={{ width: "100%", minWidth: "100%" }}>
          <Image
            src="/images/tenancy-kitchen-before-v1.png"
            alt="Before: Tenancy End Property State"
            width={1200}
            height={800}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
          />
          <div className="absolute bottom-4 left-4 z-10">
            <span className="px-4 py-1.5 rounded-full bg-[#F9FCF5]/95 text-ink-700 text-xs font-mono font-semibold uppercase tracking-wider border border-[#B7F56A] shadow-2xs whitespace-nowrap inline-block">
              BEFORE
            </span>
          </div>
        </div>
      </div>

      {/* Dragger Bar Line & Handle */}
      <div 
        className="absolute inset-y-0 w-1 bg-white cursor-ew-resize z-20 pointer-events-none border border-[#E5FBC9]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1F3A00] text-[#B7F56A] border border-[#99D055] flex items-center justify-center font-bold text-base shadow-2xs">
          <ChevronsLeftRight className="w-5 h-5 text-[#B7F56A]" aria-hidden="true" />
        </div>
      </div>

      {/* Range Input Overlay for Dragging with Accessible ARIA Label */}
      <input 
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        aria-label="Drag slider to compare before and after property deep cleaning"
        aria-valuenow={sliderPosition}
        aria-valuemin={0}
        aria-valuemax={100}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
      />
    </div>
  );
}
