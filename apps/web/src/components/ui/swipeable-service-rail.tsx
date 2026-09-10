"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/motion";

export interface SwipeCardItem {
  title: string;
  category: string;
  priceDisplay: string;
  href: string;
  badge?: string;
}

export interface SwipeableServiceRailProps {
  title: string;
  subtitle?: string;
  items: SwipeCardItem[];
}

export function SwipeableServiceRail({ title, subtitle, items }: SwipeableServiceRailProps) {
  if (!items || items.length === 0) return null;

  return (
    <SectionReveal className="space-y-4 text-start">
      <div className="space-y-1">
        <h3 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">{title}</h3>
        {subtitle && <p className="text-base text-ink-500">{subtitle}</p>}
      </div>

      {/* SWIPEABLE HORIZONTAL CAROUSEL RAIL (Mobile peek: 1 card + 15% peek) */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory custom-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-x-visible">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="snap-start shrink-0 w-[82vw] sm:w-auto bg-[#F9FCF5] rounded-[16px] p-6 border border-[#B7F56A] space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-ink-500 uppercase">{item.category}</span>
                {item.badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              <h4 className="font-heading text-xl font-medium text-ink-900">{item.title}</h4>
              <div className="font-heading font-medium text-lg text-ink-900">{item.priceDisplay}</div>
            </div>

            <div className="pt-2">
              <Link
                href={item.href}
                className="w-full py-2.5 rounded-full bg-[#F9FCF5] border border-[#E5FBC9] text-ink-600 font-medium text-sm hover:bg-[#DCFAB7] transition-colors duration-150 flex items-center justify-center gap-1.5 text-decoration-none"
              >
                <span>View Service</span>
                <ArrowRight className="w-4 h-4 text-ink-600 shrink-0" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
