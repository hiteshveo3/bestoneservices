"use client";

import { useState } from "react";
import { List, ChevronDown } from "lucide-react";

export interface TocItem {
  id: string;
  label: string;
}

export interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!items || items.length === 0) return null;

  return (
    <nav 
      aria-label="Table of Contents"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 bg-[#F8F9FA] rounded-[16px] border border-[#E5FBC9] text-start"
    >
      {/* Desktop Horizontal Navigation Rail */}
      <div className="hidden sm:flex items-center gap-6 overflow-x-auto text-base font-medium text-ink-600">
        <div className="flex items-center gap-1.5 text-xs font-mono text-ink-500 uppercase shrink-0">
          <List className="w-4 h-4 text-ink-600" />
          <span>On this page:</span>
        </div>

        <ul className="flex items-center gap-4 list-none p-0 m-0 shrink-0">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-ink-500 hover:text-ink-600 transition-colors duration-150 text-decoration-none whitespace-nowrap"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Collapsible Dropdown */}
      <div className="sm:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between text-base font-medium text-ink-600 py-1 cursor-pointer focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-ink-600" />
            <span>On this page</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-ink-600 transition-transform duration-200 ${mobileOpen ? "rotate-180" : ""}`} />
        </button>

        {mobileOpen && (
          <ul className="pt-3 border-t border-[#E5FBC9] space-y-2 list-none p-0 m-0 text-base">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-1 text-ink-500 hover:text-ink-600 text-decoration-none font-medium"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
