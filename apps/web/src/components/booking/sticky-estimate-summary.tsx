"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ChevronUp, ArrowRight, X } from "lucide-react";

export interface SummaryItem {
  label: string;
  value: string;
}

export interface StickyEstimateSummaryProps {
  serviceTitle: string;
  categoryTitle?: string;
  items: SummaryItem[];
  totalPrice?: number;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

export function StickyEstimateSummary({
  serviceTitle,
  categoryTitle = "Property Service",
  items,
  totalPrice,
  ctaText = "Continue to Booking",
  ctaHref = "/booking/",
  onCtaClick,
}: StickyEstimateSummaryProps) {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  return (
    <>
      {/* DESKTOP STICKY SUMMARY SIDEBAR (lg:block sticky top-20) */}
      <aside className="hidden lg:block sticky top-20 space-y-4 text-start">
        <div className="bg-white rounded-[16px] p-6 space-y-4">
          <div className="flex items-center justify-between border-[#ECEAE3] pb-3">
            <div>
              <span className="text-xs font-mono font-medium text-ink-500 uppercase">{categoryTitle}</span>
              <h3 className="font-heading text-xl font-medium text-ink-900">{serviceTitle}</h3>
            </div>
            <ShieldCheck className="w-5 h-5 text-ink-600 shrink-0" />
          </div>

          {/* Itemized Selection Breakdown */}
          <div className="space-y-2.5 text-sm">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 border-[#ECEAE3] pb-2">
                <span className="text-ink-500 font-normal">{item.label}</span>
                <span className="font-medium text-ink-600 text-end">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Total Price & CTA */}
          <div className="pt-2 space-y-3">
            {totalPrice !== undefined && totalPrice > 0 && (
              <div className="p-3 rounded-[16px] bg-white flex items-center justify-between font-heading font-medium text-lg text-ink-900">
                <span>Estimated Price:</span>
                <span className="text-2xl text-ink-900">£{totalPrice}</span>
              </div>
            )}

            {onCtaClick ? (
              <button
                type="button"
                onClick={onCtaClick}
                className="w-full py-3.5 rounded-xl bg-[#B7F56A] text-[#1D201E] font-semibold text-base hover:bg-[#A2EA4E] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer "
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 text-[#1D201E] shrink-0" />
              </button>
            ) : (
              <Link
                href={ctaHref}
                className="w-full py-3.5 rounded-xl bg-[#B7F56A] text-[#1D201E] font-semibold text-base hover:bg-[#A2EA4E] transition-colors duration-150 flex items-center justify-center gap-2 text-decoration-none "
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 text-[#1D201E] shrink-0" />
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE COMPACT BOTTOM BAR & EXPANDABLE SHEET (lg:hidden) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-[#ECEAE3] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-medium text-ink-500 uppercase">{serviceTitle}</span>
            <div className="font-heading font-medium text-xl text-ink-900">
              {totalPrice !== undefined && totalPrice > 0 ? `£${totalPrice}` : "Custom Quote"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileSheetOpen(!mobileSheetOpen)}
              className="px-3.5 py-2 rounded-xl bg-white text-sm font-medium text-ink-600 cursor-pointer flex items-center gap-1"
            >
              <span>Breakdown</span>
              <ChevronUp className={`w-4 h-4 text-ink-600 transition-transform duration-200 ${mobileSheetOpen ? "rotate-180" : ""}`} />
            </button>

            {onCtaClick ? (
              <button
                type="button"
                onClick={onCtaClick}
                className="px-4 py-2 rounded-xl bg-[#B7F56A] text-[#1D201E] text-sm font-semibold hover:bg-[#A2EA4E] cursor-pointer"
              >
                {ctaText}
              </button>
            ) : (
              <Link
                href={ctaHref}
                className="px-4 py-2 rounded-xl bg-[#B7F56A] text-[#1D201E] text-sm font-semibold hover:bg-[#A2EA4E] text-decoration-none"
              >
                {ctaText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE BREAKDOWN BOTTOM SHEET */}
      {mobileSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div onClick={() => setMobileSheetOpen(false)} className="fixed inset-0 bg-ink-900/50 backdrop-blur-xs" />
          <div className="relative z-10 bg-white rounded-t-3xl border-[#ECEAE3] p-6 pb-20 space-y-4 animate-in slide-in-from-bottom duration-200 text-start">
            <div className="flex items-center justify-between border-[#ECEAE3] pb-3">
              <h4 className="font-heading text-lg font-medium text-ink-900">Estimate Breakdown</h4>
              <button type="button" onClick={() => setMobileSheetOpen(false)} className="p-1 rounded-full bg-[#F6F5F1]">
                <X className="w-5 h-5 text-ink-600" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between border-[#ECEAE3] pb-1.5">
                  <span className="text-ink-500">{item.label}</span>
                  <span className="font-medium text-ink-600">{item.value}</span>
                </div>
              ))}
            </div>

            {totalPrice !== undefined && totalPrice > 0 && (
              <div className="p-3 rounded-[16px] bg-[#F6F5F1] font-heading font-medium text-lg text-ink-900 flex justify-between">
                <span>Total:</span>
                <span>£{totalPrice}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

