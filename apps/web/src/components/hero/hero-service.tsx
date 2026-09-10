"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { SectionReveal, MaskedText, StaggerGrid, StaggerItem } from "@/components/motion";

export interface HeroServiceProps {
  eyebrow: string;
  title: string;
  description: string;
  startingPrice: string;
  startingPriceLabel: string;
  guaranteeText: string;
  coverageText: string;
  heroImage: string;
  heroImageAlt: string;
  overlayBadge?: string;
  calculatorAnchor?: string;
}

export function HeroService({
  eyebrow,
  title,
  description,
  startingPrice,
  startingPriceLabel,
  guaranteeText,
  coverageText,
  heroImage,
  heroImageAlt,
  overlayBadge = "Property Checkout Ready",
  calculatorAnchor = "#calculator",
}: HeroServiceProps) {
  const [postcode, setPostcode] = useState("");

  return (
    <section className="relative pt-6 sm:pt-8 pb-14 bg-[#F9FCF5] text-start overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#1f3a000d_1px,transparent_1px),linear-gradient(to_bottom,#1f3a000d_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_65%_65%_at_50%_50%,transparent_40%,#000_100%)]" />

      {/* Ambient Brand Glow */}
      <div className="absolute -right-10 -top-10 w-[500px] h-[500px] bg-[#B7F56A]/20 blur-3xl rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Service Details & Pricing Intent */}
          <div className="lg:col-span-6 space-y-6 text-start">
            
            {/* 1. Eyebrow */}
            <SectionReveal disabled>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCFAB7] border border-[#99D055] text-[#1F3A00] text-xs sm:text-sm font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#1F3A00] shrink-0" aria-hidden="true" />
                <span>{eyebrow}</span>
              </div>
            </SectionReveal>

            {/* 2. H1 Masked Reveal */}
            <MaskedText as="h1" disabled className="font-heading text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#1F3A00] tracking-tight leading-[1.12]">
              {title}
            </MaskedText>

            {/* 3. Supporting Paragraph */}
            <SectionReveal disabled>
              <p className="text-lg text-[#1F3A00] leading-relaxed max-w-xl font-normal">
                {description}
              </p>
            </SectionReveal>

            {/* 4. Postcode / Bedroom Input (WCAG 2.1 Compliant) */}
            <SectionReveal disabled className="space-y-3 max-w-xl">
              <div className="p-1.5 sm:p-2 rounded-[16px] sm:rounded-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white border border-[#B7F56A] focus-within:ring-2 focus-within:ring-[#99D055] shadow-2xs">
                <div className="flex items-center gap-2 pl-3 sm:pl-4 w-full">
                  <MapPin className="w-4 h-4 text-[#1F3A00] shrink-0" aria-hidden="true" />
                  <label htmlFor="service-hero-postcode" className="sr-only">
                    Enter property postcode or bedrooms for instant estimate
                  </label>
                  <input 
                    id="service-hero-postcode"
                    type="text" 
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="Enter property postcode or bedrooms" 
                    aria-label="Enter property postcode or bedrooms for instant estimate"
                    className="w-full py-2.5 sm:py-3 bg-transparent text-sm sm:text-base text-[#1F3A00] placeholder:text-[#4D7220] focus:outline-none font-normal text-start"
                  />
                </div>
                <ButtonLink 
                  href={calculatorAnchor} 
                  variant="primary" 
                  aria-label={`Get instant estimate for ${title}`}
                  className="w-full sm:w-auto text-center whitespace-nowrap shrink-0 font-bold"
                >
                  Get Estimate
                </ButtonLink>
              </div>

              <div className="text-sm text-[#1F3A00] font-medium ps-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#99D055] inline-block shrink-0" aria-hidden="true"></span>
                <span>{guaranteeText} • {coverageText}</span>
              </div>
            </SectionReveal>

            {/* 5. Metrics Cards Stagger */}
            <StaggerGrid disabled className="pt-4 grid grid-cols-3 gap-3" staggerDelay={0.07}>
              <StaggerItem className="bg-[#F9FCF5] rounded-[16px] p-4 border border-[#B7F56A] text-start space-y-0.5 shadow-2xs">
                <div className="font-heading text-xl sm:text-2xl font-bold text-[#1F3A00]">{startingPrice}</div>
                <div className="text-sm text-[#1F3A00] font-medium">{startingPriceLabel}</div>
              </StaggerItem>
              <StaggerItem className="bg-[#F9FCF5] rounded-[16px] p-4 border border-[#B7F56A] text-start space-y-0.5 shadow-2xs">
                <div className="font-heading text-xl sm:text-2xl font-bold text-[#1F3A00]">48 Hours</div>
                <div className="text-sm text-[#1F3A00] font-medium">Re-Clean Support</div>
              </StaggerItem>
              <StaggerItem className="bg-[#F9FCF5] rounded-[16px] p-4 border border-[#B7F56A] text-start space-y-0.5 shadow-2xs">
                <div className="font-heading text-xl sm:text-2xl font-bold text-[#1F3A00]">London</div>
                <div className="text-sm text-[#1F3A00] font-medium">Service Coverage</div>
              </StaggerItem>
            </StaggerGrid>

          </div>

          {/* Right Column: Floating Mascot */}
          <div className="lg:col-span-6 relative flex items-center justify-center pt-4 lg:pt-0">
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] flex items-center justify-center p-2">
              <Image
                src={heroImage}
                alt={heroImageAlt}
                width={1024}
                height={1536}
                priority
                className="w-full h-auto max-h-[420px] sm:max-h-[460px] lg:max-h-[500px] object-contain object-bottom relative z-10 mx-auto"
              />

              {/* Overlay Badge */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 bg-[#F9FCF5]/95 backdrop-blur-md px-4 py-2 rounded-[16px] border border-[#B7F56A] flex items-center gap-3 text-start whitespace-nowrap shadow-2xs">
                <div className="font-heading text-xs sm:text-sm font-bold text-[#1F3A00]">
                  {overlayBadge}
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#DCFAB7] border border-[#99D055] text-[#1F3A00] text-[11px] font-mono font-bold">
                  VERIFIED
                </span>
              </div>

              {/* Soft Lime glow behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#B7F56A]/25 blur-3xl -z-10" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


