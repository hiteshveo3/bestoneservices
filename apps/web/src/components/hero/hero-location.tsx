"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { SectionReveal, MaskedText, ImageReveal } from "@/components/motion";

export interface HeroLocationProps {
  areaName: string;
  postcodesText?: string;
  description?: string;
  heroImage?: string;
}

export function HeroLocation({
  areaName,
  postcodesText = "Greater London & M25 Postcodes",
  description = `Professional cleaning, pest control, gardening, and removals services for homes and commercial properties across ${areaName} and nearby postcodes.`,
  heroImage = "/images/location-london-property-v1.png",
}: HeroLocationProps) {
  const [postcode, setPostcode] = useState("");

  return (
    <section className="relative pt-6 sm:pt-8 pb-14 bg-[#F9FCF5] text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-start">
            <SectionReveal disabled>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCFAB7] border border-[#99D055] text-[#1F3A00] text-xs sm:text-sm font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#1F3A00] shrink-0" />
                <span>Best One Services • {areaName} Hub</span>
              </div>
            </SectionReveal>

            <MaskedText as="h1" disabled className="font-heading text-4xl sm:text-5xl lg:text-[48px] font-bold text-[#1F3A00] tracking-tight leading-[1.12]">
              Professional Property Services in {areaName}
            </MaskedText>

            <SectionReveal disabled>
              <p className="text-lg text-[#1F3A00] leading-relaxed max-w-xl font-normal">
                {description}
              </p>
            </SectionReveal>

            <SectionReveal disabled className="space-y-3 max-w-xl">
              <div className="p-1.5 rounded-full flex items-center justify-between gap-2 bg-white border border-[#B7F56A] focus-within:ring-2 focus-within:ring-[#99D055] shadow-2xs">
                <div className="flex items-center gap-2 pl-4 w-full">
                  <MapPin className="w-4 h-4 text-[#1F3A00] shrink-0" />
                  <input 
                    type="text" 
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder={`Enter ${areaName} postcode`} 
                    className="w-full py-3 bg-transparent text-base text-[#1F3A00] placeholder:text-[#4D7220] focus:outline-none font-normal text-start"
                  />
                </div>
                <ButtonLink href="/prices/" variant="dark" className="whitespace-nowrap shrink-0">
                  Get Local Estimate
                </ButtonLink>
              </div>

              <div className="text-base text-[#1F3A00] font-normal ps-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#99D055] inline-block shrink-0"></span>
                <span>{postcodesText}</span>
              </div>
            </SectionReveal>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[20px] border border-[#B7F56A] overflow-hidden bg-[#F9FCF5] aspect-[4/3] max-h-[460px] shadow-2xs">
              <ImageReveal disabled 
                src={heroImage} 
                alt={`Best One Services in ${areaName}`} 
                className="w-full h-full"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#F9FCF5]/95 backdrop-blur-md p-3.5 rounded-[16px] border border-[#B7F56A] flex items-center justify-between text-start shadow-2xs">
                <div className="font-heading text-base font-bold text-[#1F3A00]">
                  {areaName} Service Hub
                </div>
                <span className="px-3 py-1 rounded-full bg-[#B7F56A] text-[#1F3A00] border border-[#99D055] text-xs font-mono font-bold">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


