import React from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { StarIcon, Refresh01Icon, Building03Icon } from '@hugeicons/core-free-icons';

export function PricingCorelSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans text-start">
      <div className="relative overflow-hidden radius-panel bg-[#F8F9FA] border border-[#E5FBC9] p-6 sm:p-10 lg:p-14">
        <div className="panel-dot-grid absolute inset-0" aria-hidden="true" />
        <div className="relative">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl sm:text-[38px] font-medium text-ink-900 tracking-tight flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-ink-100 border border-[#E5FBC9] text-ink-600 text-sm font-medium tracking-wide uppercase">New</span>
          Best One Property Suite 2026
        </h2>
        <p className="text-[19px] text-ink-600 mt-2 font-medium">
          Professional cleaning & maintenance services for London properties
        </p>
      </div>

      {/* Try Free Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 pb-8 border-b border-[#E5FBC9]">
        <Link href="/contact" className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-[#1F3A00] text-[#1F3A00] font-semibold text-[16px] hover:bg-[#1F3A00] hover:text-[#B7F56A] transition-colors duration-150 text-decoration-none bg-transparent w-full sm:w-auto">
          Get a free quote
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex text-[#FFB900]">
            {"★★★★★"}
          </div>
          <span className="text-[#1F3A00] text-sm font-medium">(1020 reviews)</span>
        </div>
      </div>

      {/* Purchase Options */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#1F3A00]">Booking options</h3>
          <Link href="/contact" className="text-[#1F3A00] flex items-center gap-1.5 font-semibold text-sm hover:underline">
            <span className="border border-[#375811] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">↑</span>
            Looking to customise?
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Annual Plan Card (Selected) */}
          <div className="border-[2px] border-[#1F3A00] rounded-[16px] overflow-hidden flex flex-col cursor-pointer bg-[#F9FCF5]">
            <div className="p-6 text-center flex-1 flex flex-col justify-center gap-2">
              <span className="mx-auto px-2.5 py-0.5 rounded-full bg-[#DCFAB7] border border-[#99D055] text-[#1F3A00] text-[11px] font-bold tracking-wide uppercase">
                Priority Plan
              </span>
              <div className="font-bold text-[#1F3A00] text-[17px]">Annual Property Cover</div>
              <div className="text-[#1F3A00] text-[15px] font-medium">£49.00/mo</div>
            </div>
          </div>

          {/* One-Time Card (Unselected) */}
          <div className="border border-[#B7F56A] rounded-[16px] overflow-hidden flex flex-col bg-[#F9FCF5]">
            <div className="p-6 text-center flex-1 flex flex-col justify-center gap-2">
              <span className="mx-auto text-[#1F3A00] text-[11px] font-semibold tracking-wide uppercase">
                Direct Booking
              </span>
              <div className="font-bold text-[#1F3A00] text-[17px]">One-Time Service</div>
              <div className="text-[#1F3A00] text-[15px]">from £130.00</div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Price */}
      <div className="mb-6">
        <p className="text-[17px] text-[#1F3A00] leading-relaxed max-w-3xl mb-6 font-normal">
          Subscribe and for just £49.00/mo, get prioritized booking, exclusive seasonal deep cleans, regular inspections, and guaranteed same-day dispatch.
        </p>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-[32px] font-bold text-[#1F3A00]">£439.00</span>
          <span className="text-[14px] text-[#1F3A00] font-medium">/year</span>
        </div>

        <Link href="/prices" className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 text-decoration-none cursor-pointer">
          Subscribe now
        </Link>
      </div>

      {/* Features list */}
      <ul className="space-y-4 pt-4 text-[17px] text-ink-600 font-normal">
        <li className="flex items-center gap-3">
          <HugeiconsIcon icon={StarIcon} size={20} className="text-ink-500 shrink-0" />
          Subscription-exclusive features
        </li>
        <li className="flex items-center gap-3">
          <HugeiconsIcon icon={Refresh01Icon} size={20} className="text-ink-500 shrink-0" />
          Renew subscription
        </li>
        <li className="flex items-center gap-3">
          <HugeiconsIcon icon={Building03Icon} size={20} className="text-ink-500 shrink-0" />
          Buy for business
        </li>
      </ul>
        </div>
      </div>
    </section>
  );
}
