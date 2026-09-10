"use client";

"use client";

import { Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { SectionReveal, MaskedText, ImageReveal } from "@/components/motion";

export function HeroAbout() {
  return (
    <section className="relative pt-8 lg:pt-12 pb-14 bg-[#F9FCF5] text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-start">
            <SectionReveal disabled>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCFAB7] border border-[#99D055] text-[#1F3A00] text-xs sm:text-sm font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#1F3A00] shrink-0" />
                <span>About Best One Services</span>
              </div>
            </SectionReveal>

            <MaskedText as="h1" disabled className="font-heading text-4xl sm:text-5xl lg:text-[48px] font-bold text-[#1F3A00] tracking-tight leading-[1.12]">
              One Team. Multiple Property Services.
            </MaskedText>

            <SectionReveal disabled>
              <p className="text-lg text-[#1F3A00] leading-relaxed max-w-xl font-normal">
                Founded to simplify property care across London. We combine professional tenancy cleaning, pest control, gardening, and removals into one transparent service platform.
              </p>
            </SectionReveal>

            <SectionReveal disabled className="flex items-center gap-3 pt-2">
              <ButtonLink href="/prices/" variant="dark">
                Explore All Services & Rates
              </ButtonLink>
              <ButtonLink href="/contact/" variant="outline">
                Contact Our Team
              </ButtonLink>
            </SectionReveal>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[20px] border border-[#B7F56A] overflow-hidden bg-[#F9FCF5] aspect-[4/3] max-h-[460px] shadow-2xs">
              <ImageReveal disabled 
                src="/images/about-team-v1.png" 
                alt="About Best One Services Team" 
                className="w-full h-full"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#F9FCF5]/95 backdrop-blur-md p-3.5 rounded-[16px] border border-[#B7F56A] flex items-center justify-between text-start shadow-2xs">
                <div className="font-heading text-base font-bold text-[#1F3A00]">
                  Serving London Properties
                </div>
                <span className="px-3 py-1 rounded-full bg-[#B7F56A] text-[#1F3A00] border border-[#99D055] text-xs font-mono font-bold">
                  TRUSTED
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


