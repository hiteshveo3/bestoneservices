"use client";

import Link from "next/link";
import { Tag, ArrowRight } from "lucide-react";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion";

export interface PricingTierPreview {
  label: string;
  priceDisplay: string;
  subtext?: string;
}

export interface ServicePricingPreviewProps {
  title?: string;
  subtitle?: string;
  category?: string;
  serviceId?: string;
  tiers: PricingTierPreview[];
}

export function ServicePricingPreview({
  title = "Pricing at a Glance",
  subtitle = "Flat-rate starting prices based on property size and service requirements",
  category = "cleaning",
  serviceId = "end-of-tenancy",
  tiers,
}: ServicePricingPreviewProps) {
  if (!tiers || tiers.length === 0) return null;

  const calculatorUrl = `/prices/?category=${encodeURIComponent(category)}&service=${encodeURIComponent(serviceId)}#smart-calculator`;

  return (
    <SectionReveal className="bg-white rounded-[20px] p-6 sm:p-8 space-y-6 text-start ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[#ECEAE3] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 ts-eyebrow">
            <Tag className="w-3.5 h-3.5 text-[#1D201E] shrink-0" />
            <span>Transparent Rates</span>
          </div>
          <h3 className="font-heading text-2xl font-bold text-[#1D201E]">{title}</h3>
          <p className="text-base text-[#1D201E] font-normal">{subtitle}</p>
        </div>

        <Link
          href={calculatorUrl}
          className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1D201E] border-none hover:opacity-90 transition-opacity duration-200 text-decoration-none shrink-0 gap-1.5 cursor-pointer"
        >
          <span>Calculate My Price</span>
          <ArrowRight className="w-4 h-4 text-[#1D201E]" />
        </Link>
      </div>

      <StaggerGrid className="grid grid-cols-2 sm:grid-cols-5 gap-3" staggerDelay={0.05}>
        {tiers.map((tier, idx) => (
          <StaggerItem key={idx} className="p-4 rounded-[16px] bg-white space-y-1 text-start">
            <div className="font-heading font-semibold text-base text-[#1D201E]">{tier.label}</div>
            <div className="font-heading font-bold text-2xl text-[#1D201E]">{tier.priceDisplay}</div>
            {tier.subtext && (
              <div className="text-xs font-mono text-[#1D201E]">{tier.subtext}</div>
            )}
          </StaggerItem>
        ))}
      </StaggerGrid>
    </SectionReveal>
  );
}

