"use client";

import { ReactNode } from "react";
import { SectionReveal } from "@/components/motion";

export interface EditorialFactProps {
  value: string;
  label: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}

export function EditorialFact({
  value,
  label,
  description,
  icon,
  className = "",
}: EditorialFactProps) {
  return (
    <SectionReveal className={`py-8 text-start ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-8 rounded-[16px] bg-white border border-[#B7F56A]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-12 h-12 rounded-[16px] bg-[#1F3A00] text-white flex items-center justify-center font-medium shrink-0">
                {icon}
              </div>
            )}
            <div className="font-heading font-medium text-4xl sm:text-6xl text-ink-900 tracking-tight">
              {value}
            </div>
          </div>
          <div className="text-xs font-mono font-medium text-ink-500 uppercase tracking-wider">
            {label}
          </div>
        </div>

        <div className="sm:border-l sm:border-[#E5FBC9] sm:pl-6 text-base text-ink-500 leading-relaxed max-w-xl font-normal">
          {description}
        </div>
      </div>
    </SectionReveal>
  );
}
