"use client";

import { Tag } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { SectionReveal, MaskedText, StaggerGrid, StaggerItem } from "@/components/motion";

export function HeroPricing() {
  return (
    <section className="relative pt-8 lg:pt-12 pb-14 bg-[#F6F5F1] text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Information-Led Pricing Value */}
          <div className="lg:col-span-6 space-y-6 text-start">
            <SectionReveal disabled>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF8D6] border border-[#ECEAE3] text-[#1D201E] text-xs sm:text-sm font-bold uppercase tracking-wider">
                <Tag className="w-4 h-4 text-[#1D201E]" />
                <span>Clear & Transparent Pricing</span>
              </div>
            </SectionReveal>

            <MaskedText as="h1" disabled className="font-heading text-4xl sm:text-5xl lg:text-[48px] font-bold text-[#1D201E] tracking-tight leading-[1.12]">
              Know What Your Service Costs Before You Book.
            </MaskedText>

            <SectionReveal disabled>
              <p className="text-lg text-[#1D201E] leading-relaxed max-w-xl font-normal">
                Explore cleaning, pest control, gardening and removals rates by property size and job requirements, backed by our clear pricing rules.
              </p>
            </SectionReveal>

            <SectionReveal disabled className="flex flex-wrap items-center gap-3 pt-2">
              <ButtonLink href="#smart-calculator" variant="dark">
                Calculate My Price
              </ButtonLink>
              <ButtonLink href="#rates-grid" variant="outline">
                Browse All Rates
              </ButtonLink>
            </SectionReveal>

            <SectionReveal disabled className="pt-2 text-base text-[#1D201E] font-mono flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A2EA4E] inline-block shrink-0"></span>
              <span>100% Free Upfront Quotes • Zero Hidden Charges</span>
            </SectionReveal>
          </div>

          {/* Right Column: Information-Rich Live Starting Rates Preview Cards */}
          <div className="lg:col-span-6 relative">
            <StaggerGrid disabled className="grid sm:grid-cols-2 gap-4" staggerDelay={0.07}>
              {[
                { title: "End of Tenancy", rate: "From £130", desc: "Studio – 4 Bed flat rates" },
                { title: "Pest Control", rate: "From £99", desc: "Mice, rats & bug treatment" },
                { title: "Gardening Care", rate: "£70/hr min", desc: "2-gardener team model" },
                { title: "House Removals", rate: "From £80/hr", desc: "2 or 3 men + Luton Van" },
              ].map((card, i) => (
                <StaggerItem key={i} className="bg-[#F6F5F1] rounded-[16px] p-5 border border-[#ECEAE3] space-y-2 text-start ">
                  <div className="flex justify-between items-start">
                    <span className="font-heading text-base font-bold text-[#1D201E]">{card.title}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EAF8D6] border border-[#ECEAE3] text-[#1D201E] text-xs font-mono font-bold">
                      {card.rate}
                    </span>
                  </div>
                  <p className="text-sm text-[#1D201E] font-normal">{card.desc}</p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>

        </div>
      </div>
    </section>
  );
}


