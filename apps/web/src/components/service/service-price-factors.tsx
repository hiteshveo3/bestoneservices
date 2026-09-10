"use client";

import { HelpCircle, CheckCircle2 } from "lucide-react";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion";

export interface ServicePriceFactorsProps {
  title?: string;
  subtitle?: string;
  factors: string[];
}

export function ServicePriceFactors({
  title = "What Affects Your Service Price?",
  subtitle = "Understanding the key variables that influence final estimate calculations",
  factors,
}: ServicePriceFactorsProps) {
  if (!factors || factors.length === 0) return null;

  return (
    <SectionReveal className="bg-[#F8F9FA] rounded-[16px] p-6 sm:p-8 border border-[#E5FBC9] space-y-6 text-start">
      <div className="space-y-1 border-b border-[#E5FBC9] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-100 border border-[#E5FBC9] text-ink-600 text-xs font-mono font-medium uppercase">
          <HelpCircle className="w-3.5 h-3.5 text-ink-600 shrink-0" />
          <span>Pricing Factors</span>
        </div>
        <h3 className="font-heading text-2xl font-medium text-ink-900">{title}</h3>
        <p className="text-base text-ink-500 font-normal">{subtitle}</p>
      </div>

      <StaggerGrid className="grid sm:grid-cols-2 gap-4" staggerDelay={0.06}>
        {factors.map((factor, idx) => (
          <StaggerItem key={idx} className="flex items-start gap-3 p-4 rounded-[16px] bg-white border border-[#B7F56A]">
            <CheckCircle2 className="w-5 h-5 text-ink-600 shrink-0 mt-0.5" />
            <span className="text-base text-ink-600 font-medium leading-snug">{factor}</span>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </SectionReveal>
  );
}
