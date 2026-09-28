"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Sparkles, Bug, Trees, Truck } from "lucide-react";
import { megaMenuData, type MegaMenuFeaturePanel } from "@/config/site-navigation";

export interface DesktopMegaMenuProps {
  activeCategory: "cleaning" | "pest" | "gardening" | "removals" | null;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ICON_MAP = {
  Sparkles,
  Bug,
  Trees,
  Truck,
};

export function DesktopMegaMenu({
  activeCategory,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: DesktopMegaMenuProps) {
  const pathname = usePathname();

  if (!activeCategory) return null;

  const categoryData = megaMenuData.find((c) => c.id === activeCategory);
  if (!categoryData) return null;

  const panel = categoryData.featurePanel;
  const PanelIcon = ICON_MAP[panel.iconName] || Sparkles;

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation menu"
        className="absolute inset-x-0 top-full z-30 hidden h-screen cursor-default bg-[#1D201E]/40 lg:block"
        onClick={onClose}
      />
      <div
      id={`mega-menu-${activeCategory}`}
      role="region"
      aria-label={`${categoryData.label} navigation menu`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="hidden lg:block absolute top-full left-0 right-0 z-40 bg-[#F6F5F1] border-[#ECEAE3] text-start transition-opacity duration-200 "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 py-8">
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 items-start">
          
          {/* Left & Center Columns: Primary Service & Useful Links */}
          {categoryData.columns.map((col, colIdx) => (
            <div key={colIdx} className="space-y-4 min-w-0">
              <h3 className="font-heading text-base font-semibold text-[#1D201E] tracking-[-0.01em] border-[#ECEAE3] pb-3 flex items-center gap-2">
                <span>{col.title}</span>
              </h3>

              <ul className="space-y-1 list-none p-0 m-0">
                {col.items.map((item, itemIdx) => {
                  const isCurrentPage = pathname === item.href;

                  return (
                    <li key={itemIdx}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`group flex items-center justify-between px-3 py-2 rounded-[10px] text-base transition-colors duration-150 text-decoration-none ${
 isCurrentPage
 ? "bg-[#EAF8D6] font-semibold text-[#1D201E]"
 : item.isFeatured
 ? "bg-white font-medium text-[#1D201E] hover:bg-[#EAF8D6]"
 : "text-[#1D201E] font-normal hover:bg-white"
 }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {item.price ? (
                          <span className="ts-fig shrink-0 text-lg"><small>from</small>{item.price}</span>
                        ) : item.badge && (
                          <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-[#EAF8D6] text-[#1D201E] shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Right Column: Purposeful Contextual Action Panel (Solid Surface, Unclipped) */}
          <div className="hidden xl:flex flex-col p-6 rounded-2xl bg-[image:var(--grad-lime-soft)] space-y-4 text-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#EAF8D6] flex items-center justify-center shrink-0">
                <PanelIcon className="w-5 h-5 text-[#1D201E] shrink-0" />
              </div>
              <span className="ts-eyebrow">
                {categoryData.label}
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-heading text-xl font-bold text-[#1D201E] leading-snug">
                {panel.title}
              </h4>
              <p className="text-sm text-[#1D201E] font-normal leading-relaxed">
                {panel.description}
              </p>
            </div>

            <div className="pt-1">
              <Link
                href={panel.ctaHref}
                onClick={onClose}
                className="inline-flex min-h-11 items-center gap-2 px-5 rounded-xl text-base font-semibold bg-[#B7F56A] text-[#1D201E] border-none hover:bg-[#A2EA4E] transition-colors duration-150 text-decoration-none"
              >
                <span>{panel.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-[#1D201E] shrink-0" />
              </Link>
            </div>
          </div>

        </div>
      </div>
      </div>
    </>
  );
}

