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
    <SectionReveal className="bg-[#F9FCF5] rounded-[20px] p-6 sm:p-8 border border-[#B7F56A] space-y-6 text-start shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5FBC9] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFAB7] border border-[#99D055] text-[#1F3A00] text-xs font-bold uppercase">
            <Tag className="w-3.5 h-3.5 text-[#1F3A00] shrink-0" />
            <span>Transparent Rates</span>
          </div>
          <h3 className="font-heading text-2xl font-bold text-[#1F3A00]">{title}</h3>
          <p className="text-base text-[#1F3A00] font-normal">{subtitle}</p>
        </div>

        <Link
          href={calculatorUrl}
          className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 text-decoration-none shrink-0 gap-1.5 cursor-pointer"
        >
          <span>Calculate My Price</span>
          <ArrowRight className="w-4 h-4 text-[#1F3A00]" />
        </Link>
      </div>

      <StaggerGrid className="grid grid-cols-2 sm:grid-cols-5 gap-3" staggerDelay={0.05}>
        {tiers.map((tier, idx) => (
          <StaggerItem key={idx} className="p-4 rounded-[16px] bg-[#F9FCF5] border border-[#E5FBC9] space-y-1 text-start">
            <div className="font-heading font-semibold text-base text-[#1F3A00]">{tier.label}</div>
            <div className="font-heading font-bold text-2xl text-[#1F3A00]">{tier.priceDisplay}</div>
            {tier.subtext && (
              <div className="text-xs font-mono text-[#1F3A00]">{tier.subtext}</div>
            )}
          </StaggerItem>
        ))}
      </StaggerGrid>
    </SectionReveal>
  );
}

