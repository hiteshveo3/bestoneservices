"use client";

import { useState } from "react";
import { Check, Info } from "lucide-react";
import { ButtonLink } from "@/components/button-link";

export interface PropertyTier {
  sizeKey: string;
  label: string;
  standardPrice: number;
  premiumPrice: number;
}

const PROPERTY_TIERS: PropertyTier[] = [
  { sizeKey: "studio", label: "Studio", standardPrice: 130, premiumPrice: 160 },
  { sizeKey: "1bed", label: "1 Bedroom", standardPrice: 200, premiumPrice: 230 },
  { sizeKey: "2bed", label: "2 Bedroom", standardPrice: 230, premiumPrice: 280 },
  { sizeKey: "3bed", label: "3 Bedroom", standardPrice: 300, premiumPrice: 350 },
  { sizeKey: "4bed", label: "4 Bedroom", standardPrice: 350, premiumPrice: 420 },
];

export function ServicePricingSection() {
  const [selectedSize, setSelectedSize] = useState<string>("studio");
  const [tier, setTier] = useState<"standard" | "premium">("standard");

  const currentTier = PROPERTY_TIERS.find((t) => t.sizeKey === selectedSize) || PROPERTY_TIERS[0];
  const activePrice = tier === "standard" ? currentTier.standardPrice : currentTier.premiumPrice;

  return (
    <section id="pricing" className="bg-white rounded-[16px] p-8 sm:p-12 space-y-8 text-start">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-[#ECEAE3] pb-6">
        <div>
          <span className="px-3.5 py-1 rounded-xl bg-ink-100 border border-[#ECEAE3] text-ink-600 text-base font-mono font-medium uppercase">
            OFFICIAL BESTONE PRICING DATA
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-[650] text-ink-900 pt-2">
            End of Tenancy Rates By Property Size
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTier("standard")}
            className={`px-4 py-2.5 rounded-xl text-base font-bold transition-colors duration-150 cursor-pointer ${ tier === "standard" ? "bg-[#B7F56A] text-[#1D201E] border-[#1D201E]" : "bg-white text-[#1D201E] hover:text-[#1D201E] " }`}
          >
            Standard Package
          </button>
          <button
            onClick={() => setTier("premium")}
            className={`px-4 py-2.5 rounded-xl text-base font-bold transition-colors duration-150 cursor-pointer flex items-center gap-1.5 ${ tier === "premium" ? "bg-[#B7F56A] text-[#1D201E] border-[#1D201E]" : "bg-white text-[#1D201E] hover:text-[#1D201E] " }`}
          >
            <span>Premium Package</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#EAF8D6] text-[#1D201E] ">
              Recommended
            </span>
          </button>
        </div>
      </div>

      {/* Property Size Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {PROPERTY_TIERS.map((item) => {
          const isSelected = selectedSize === item.sizeKey;
          const displayPrice = tier === "standard" ? item.standardPrice : item.premiumPrice;
          return (
            <button
              key={item.sizeKey}
              onClick={() => setSelectedSize(item.sizeKey)}
              className={`p-4 rounded-[16px] transition-colors duration-150 text-start cursor-pointer ${ isSelected ? "bg-[#B7F56A] border-[#1D201E] text-[#1D201E] " : "bg-white text-[#1D201E] hover:bg-[#EAF8D6]/60" }`}
            >
              <div className="font-heading font-semibold text-base">{item.label}</div>
              <div className="font-heading font-bold text-2xl pt-1">£{displayPrice}</div>
              <div className="text-xs font-mono opacity-80">
                {tier === "standard" ? "Standard" : "Premium"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Pricing Highlight Container */}
      <div className="p-6 rounded-[20px] bg-white flex flex-col md:flex-row items-center justify-between gap-6 ">
        <div className="space-y-2 text-start">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-[#EAF8D6] text-[#1D201E] text-xs font-mono font-bold">
              {currentTier.label} — {tier.toUpperCase()} PACKAGE
            </span>
          </div>
          <div className="font-heading text-4xl font-bold text-[#1D201E] pt-1">
            £{activePrice} <span className="text-base font-normal text-[#1D201E]">(Flat-Rate Quote)</span>
          </div>
          <p className="text-base text-ink-500 font-normal">
            {tier === "standard"
              ? "Includes full room-by-room deep clean, kitchen cupboard interiors, and bathroom descaling."
              : "Includes full deep clean plus single oven appliance detailing and carpet steam extraction (up to 2 rooms)."}
          </p>
        </div>

        <ButtonLink href="#calculator" variant="dark" className="shrink-0 w-full md:w-auto">
          Book This Estimate
        </ButtonLink>
      </div>

      {/* Official Business Pricing Rules Box */}
      <div className="p-6 rounded-[16px] bg-white space-y-4">
        <div className="flex items-center gap-2 font-heading font-medium text-xl text-ink-900">
          <Info className="w-5 h-5 text-ink-600 shrink-0" />
          <span>Official Pricing Terms & Conditions</span>
        </div>
        <ul className="grid sm:grid-cols-2 gap-3 text-base text-ink-500 list-none p-0">
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-ink-600 shrink-0 mt-0.5" />
            <span><strong>5+ Bedroom Properties:</strong> Require custom pricing (£450–£650+).</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-ink-600 shrink-0 mt-0.5" />
            <span><strong>Minimum Service Charge:</strong> £60 minimum booking charge applies.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-ink-600 shrink-0 mt-0.5" />
            <span><strong>Property Condition:</strong> Properties with heavy neglect may require custom quote.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-ink-600 shrink-0 mt-0.5" />
            <span><strong>48-Hour Guarantee:</strong> Complimentary re-clean visit within 48h if requested.</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
