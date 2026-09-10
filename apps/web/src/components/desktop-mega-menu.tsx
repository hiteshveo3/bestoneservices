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
        className="fixed inset-x-0 bottom-0 top-[127px] z-30 hidden cursor-default bg-black/45 lg:block"
        onClick={onClose}
      />
      <div
      id={`mega-menu-${activeCategory}`}
      role="region"
      aria-label={`${categoryData.label} navigation menu`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="hidden lg:block absolute top-full left-0 right-0 z-40 bg-[#F9FCF5] border-b border-[#E5FBC9] text-start transition-opacity duration-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 py-8">
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 items-start">
          
          {/* Left & Center Columns: Primary Service & Useful Links */}
          {categoryData.columns.map((col, colIdx) => (
            <div key={colIdx} className="space-y-4 min-w-0">
              <h3 className="font-heading text-base font-semibold text-[#1F3A00] tracking-[-0.01em] border-b border-[#E5FBC9] pb-3 flex items-center gap-2">
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
                        className={`group flex items-center justify-between px-3 py-2 rounded-[16px] text-base transition-colors duration-150 text-decoration-none ${
                          isCurrentPage
                            ? "bg-[#DCFAB7] font-semibold text-[#1F3A00]"
                            : item.isFeatured
                            ? "bg-white border border-[#B7F56A] font-medium text-[#1F3A00] hover:bg-[#DCFAB7]"
                            : "text-[#1F3A00] font-normal hover:underline hover:underline-offset-2"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#DCFAB7] border border-[#99D055] text-[#1F3A00] shrink-0">
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
          <div className="hidden xl:flex flex-col p-6 rounded-[16px] bg-white border border-[#B7F56A] space-y-4 text-start shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#DCFAB7] border border-[#99D055] flex items-center justify-center shrink-0">
                <PanelIcon className="w-5 h-5 text-[#1F3A00] shrink-0" />
              </div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1F3A00]">
                {categoryData.label} Context
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-heading text-xl font-bold text-[#1F3A00] leading-snug">
                {panel.title}
              </h4>
              <p className="text-sm text-[#1F3A00] font-normal leading-relaxed">
                {panel.description}
              </p>
            </div>

            <div className="pt-1">
              <Link
                href={panel.ctaHref}
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 text-decoration-none"
              >
                <span>{panel.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-[#1F3A00] shrink-0" />
              </Link>
            </div>
          </div>

        </div>
      </div>
      </div>
    </>
  );
}

