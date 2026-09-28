"use client";

import Link from "next/link";
import { Calculator, ArrowRight, Tag } from "@/components/icons";
import { SectionReveal } from "@/components/motion";

export interface SmartPricingCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  category?: string;
  serviceId?: string;
}

export function SmartPricingCTA({
  title = "Ready to See Your Exact Service Price?",
  subtitle = "Answer a few quick questions to calculate your estimate based on your property specifications.",
  buttonText = "Calculate My Price",
  category = "cleaning",
  serviceId = "end-of-tenancy",
}: SmartPricingCTAProps) {
  const pricingHref = `/prices/?category=${encodeURIComponent(category)}&service=${encodeURIComponent(serviceId)}#smart-calculator`;

  return (
    <SectionReveal className="bg-white rounded-[20px] p-6 sm:p-8 space-y-4 text-start ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 ts-eyebrow">
            <Tag className="w-3.5 h-3.5 text-[#1D201E] shrink-0" aria-hidden="true" />
            <span>Instant Estimator</span>
          </div>
          <h3 className="font-heading text-2xl font-bold text-[#1D201E]">{title}</h3>
          <p className="text-base text-[#1D201E] font-normal">{subtitle}</p>
        </div>

        <Link
          href={pricingHref}
          aria-label={`Open pricing calculator: ${buttonText}`}
          className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1D201E] border-none hover:opacity-90 transition-opacity duration-200 shrink-0 gap-2 text-decoration-none cursor-pointer"
        >
          <Calculator className="w-4 h-4 text-[#1D201E] shrink-0" aria-hidden="true" />
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4 text-[#1D201E] shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </SectionReveal>
  );
}

