"use client";

import Link from "next/link";
import { Check, ShieldCheck, ArrowRight } from "lucide-react";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion";

export interface ComparisonTier {
  title: string;
  priceDisplay: string;
  isRecommended?: boolean;
  guaranteeText: string;
  features: string[];
  ctaHref: string;
}

export interface SelectiveComparisonMatrixProps {
  title?: string;
  subtitle?: string;
  category: "cleaning" | "pest" | "removals";
  tiers?: ComparisonTier[];
}

const DEFAULT_TIERS: Record<"cleaning" | "pest" | "removals", ComparisonTier[]> = {
  cleaning: [
    {
      title: "Standard Package",
      priceDisplay: "From £130 (Studio)",
      guaranteeText: "48-Hour Re-Clean Support",
      features: [
        "Full room-by-room deep sanitisation",
        "Kitchen cupboards & hob degreasing",
        "Bathroom descaling & tiles",
        "Internal windows & skirting boards",
      ],
      ctaHref: "/prices/?category=cleaning#smart-calculator",
    },
    {
      title: "Premium Package",
      priceDisplay: "From £160 (Studio)",
      isRecommended: true,
      guaranteeText: "48-Hour Re-Clean Support",
      features: [
        "Everything in Standard Package",
        "Double Oven deep appliance degreasing",
        "Carpet Steam Extraction (Up to 2 Rooms)",
        "Priority inspection re-clean response",
      ],
      ctaHref: "/prices/?category=cleaning#smart-calculator",
    },
  ],

  pest: [
    {
      title: "Single Visit",
      priceDisplay: "From £90",
      guaranteeText: "Single Eradication Treatment",
      features: [
        "Full property pest inspection",
        "Professional baiting & eradication",
        "Basic ingress point advice",
      ],
      ctaHref: "/prices/?category=pest-control#smart-calculator",
    },
    {
      title: "2 Visits Package",
      priceDisplay: "From £160",
      isRecommended: true,
      guaranteeText: "1-Month Written Guarantee",
      features: [
        "Initial inspection & baiting",
        "Follow-up visit & bait refresh",
        "Minor entry point proofing",
        "1-Month re-attendance guarantee",
      ],
      ctaHref: "/prices/?category=pest-control#smart-calculator",
    },
    {
      title: "3 Visits Package",
      priceDisplay: "From £210",
      guaranteeText: "3-Month Written Guarantee",
      features: [
        "3 scheduled technician visits",
        "Full ingress seal & timber proofing",
        "High-density baiting stations",
        "3-Month re-attendance guarantee",
      ],
      ctaHref: "/prices/?category=pest-control#smart-calculator",
    },
  ],

  removals: [
    {
      title: "2 Men + Luton Van",
      priceDisplay: "From £80/hr",
      guaranteeText: "Goods-in-Transit Insurance",
      features: [
        "2 professional movers + Luton van",
        "Protective blankets & straps",
        "Minimum 2 hours booking (£160)",
        "Loading, transport & unloading",
      ],
      ctaHref: "/prices/?category=removals#smart-calculator",
    },
    {
      title: "3 Men + Large Van",
      priceDisplay: "From £120/hr",
      isRecommended: true,
      guaranteeText: "Goods-in-Transit Insurance",
      features: [
        "3 professional movers + Luton van",
        "Heavy furniture & stair handling",
        "Minimum 2 hours booking (£240)",
        "Full packing add-on support",
      ],
      ctaHref: "/prices/?category=removals#smart-calculator",
    },
  ],
};

export function SelectiveComparisonMatrix({
  title = "Compare Service Packages",
  subtitle = "Clear package specifications to help you choose the right tier for your property",
  category,
  tiers = DEFAULT_TIERS[category],
}: SelectiveComparisonMatrixProps) {
  if (!tiers || tiers.length === 0) return null;

  return (
    <SectionReveal className="bg-[#F9FCF5] rounded-[16px] p-6 sm:p-10 border border-[#B7F56A] space-y-6 text-start">
      <div className="space-y-1 border-b border-[#E5FBC9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
          <span>Package Comparison</span>
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-medium text-ink-900">{title}</h3>
        <p className="text-base text-ink-500">{subtitle}</p>
      </div>

      <StaggerGrid className={`grid gap-4 items-stretch ${tiers.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`} staggerDelay={0.06}>
        {tiers.map((tier, idx) => (
          <StaggerItem
            key={idx}
            className={`p-6 rounded-[16px] border flex flex-col justify-between space-y-4 text-start relative ${ tier.isRecommended ? "bg-[#F9FCF5] border-2 border-[#99D055] " : "bg-[#F9FCF5] border-[#E5FBC9]" }`}
          >
            {tier.isRecommended && (
              <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[#1F3A00] text-white text-xs font-mono font-medium uppercase">
                Recommended
              </div>
            )}

            <div className="space-y-3">
              <div>
                <h4 className="font-heading font-medium text-xl text-ink-900">{tier.title}</h4>
                <div className="font-heading font-medium text-2xl text-ink-900 pt-1">{tier.priceDisplay}</div>
              </div>

              <div className="p-2.5 rounded-[16px] bg-[#F9FCF5]/80 border border-[#B7F56A]/80 text-xs font-mono text-ink-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-ink-600 shrink-0" />
                <span>{tier.guaranteeText}</span>
              </div>

              <ul className="space-y-2 text-sm text-ink-600 list-none p-0 pt-2">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-ink-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Link
                href={tier.ctaHref}
                className={`w-full py-3 rounded-full text-base font-medium transition-colors duration-150 flex items-center justify-center gap-2 text-decoration-none ${
                  tier.isRecommended
                    ? "bg-[#1F3A00] text-[#B7F56A] hover:bg-[#2d5004]"
                    : "bg-white border border-[#E5FBC9] text-ink-600 hover:bg-[#DCFAB7]"
                }`}
              >
                <span>Calculate Package Price</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </SectionReveal>
  );
}
