"use client";

import type { QuickFilterKey } from "@/lib/use-service-filters";

interface QuickFilterShortcutsProps {
  onSelect: (key: QuickFilterKey) => void;
  activeQuickFilter?: QuickFilterKey | null;
}

interface ShortcutItem {
  key: QuickFilterKey;
  icon: string;
  title: string;
  subtitle: string;
}

const SHORTCUTS: ShortcutItem[] = [
  {
    key: "moving-out",
    icon: "🏠",
    title: "Moving Out Soon",
    subtitle: "Cleaning & Removals combo",
  },
  {
    key: "pest-emergency",
    icon: "🐭",
    title: "Pest Emergency",
    subtitle: "Same-day pest callout",
  },
  {
    key: "garden-tidy",
    icon: "🌿",
    title: "Garden Tidy-Up",
    subtitle: "Lawn care & clearances",
  },
  {
    key: "van-only",
    icon: "📦",
    title: "Just Need a Van",
    subtitle: "One-off Man & Van mover",
  },
  {
    key: "maintenance",
    icon: "🔄",
    title: "Regular Maintenance",
    subtitle: "Ongoing upkeep & contracts",
  },
];

export function QuickFilterShortcuts({
  onSelect,
  activeQuickFilter,
}: QuickFilterShortcutsProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1F3A00]/70">
          Popular Intent Shortcuts
        </span>
        <span className="text-xs text-[#1F3A00]/60 hidden sm:inline">
          One tap to apply relevant filters
        </span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
        {SHORTCUTS.map((item) => {
          const isActive = activeQuickFilter === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={`shrink-0 inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-[14px] border-2 text-start transition-colors duration-150 cursor-pointer shadow-2xs ${
                isActive
                  ? "bg-[#B7F56A] border-[#82C337] text-[#1F3A00] font-bold shadow-xs"
                  : "bg-[#DCFAB7]/50 hover:bg-[#DCFAB7] border-[#B7F56A] text-[#1F3A00]"
              }`}
            >
              <span className="text-lg leading-none" role="img" aria-hidden="true">
                {item.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#1F3A00] whitespace-nowrap leading-tight">
                  {item.title}
                </span>
                <span className="text-[11px] text-[#1F3A00]/75 whitespace-nowrap leading-tight">
                  {item.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
