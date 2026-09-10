"use client";

import Link from "next/link";
import { Sparkles, SprayCan, Trees, Truck, ArrowRight } from "lucide-react";

export interface HeroShortcutsProps {
  className?: string;
}

export function HeroShortcuts({ className = "" }: HeroShortcutsProps) {
  const shortcuts = [
    { label: "Cleaning", href: "/cleaning-services/end-of-tenancy-cleaning/", icon: Sparkles },
    { label: "Pest Control", href: "/pest-control-services/", icon: SprayCan },
    { label: "Gardening", href: "/gardening/", icon: Trees },
    { label: "Removals", href: "/removals/", icon: Truck },
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="text-xs font-mono font-medium text-ink-500 uppercase mb-2 text-start">
        QUICK SERVICE SHORTCUTS
      </div>
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {shortcuts.map((sc) => {
          const Icon = sc.icon;
          return (
            <Link
              key={sc.href}
              href={sc.href}
              className="snap-start py-2.5 px-4 rounded-[16px] bg-white border border-[#B7F56A] hover:bg-[#DCFAB7]/20 hover:border-ink-900 transition-colors duration-200 flex items-center gap-2.5 text-[#1F3A00] text-decoration-none whitespace-nowrap font-medium text-base shrink-0 group"
            >
              <div className="w-6 h-6 rounded-[16px] bg-[#1F3A00] text-white flex items-center justify-center font-medium">
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span>{sc.label}</span>
              <ArrowRight className="w-4 h-4 text-ink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
