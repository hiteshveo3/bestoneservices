"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { SectionReveal, MaskedText, StaggerGrid, StaggerItem, ImageReveal } from "@/components/motion";
import { AnimatedIllustration } from "@/components/illustrations/animated-illustration";

const ILLUSTRATION_PATH = /^\/images\/illustrations\/([^/]+)-source\.png$/;

export interface ServiceHeroProps {
  badge: string;
  title: string;
  description: string;
  startingPrice: string;
  startingPriceLabel: string;
  guaranteeText: string;
  coverageText: string;
  heroImage: string;
  heroImageAlt: string;
  imageTagline: string;
  imageSubtag: string;
}

export function ServiceHero({
  badge,
  title,
  description,
  startingPrice,
  startingPriceLabel,
  guaranteeText,
  coverageText,
  heroImage,
  heroImageAlt,
}: ServiceHeroProps) {
  const illustrationSlug = heroImage.match(ILLUSTRATION_PATH)?.[1];

  return (
    <section className="relative pt-6 sm:pt-8 pb-14 overflow-hidden bg-[#F9FCF5] text-start">
      
      {/* 🌟 WINNING BACKGROUND MIX */}
      {/* 1. Side Margins Micro Mesh Grid (Center & Text 100% Pattern-Free) */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#0000000e_1px,transparent_1px),linear-gradient(to_bottom,#0000000e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_65%_65%_at_50%_50%,transparent_40%,#000_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 space-y-6 text-start">
            
            {/* 0. Semantic ARIA Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-2">
              <ol className="flex items-center gap-2 text-xs sm:text-sm font-medium text-ink-500">
                <li><Link href="/" className="hover:text-ink-600 transition-colors duration-150 text-decoration-none">Home</Link></li>
                <li><span aria-hidden="true">•</span></li>
                <li><Link href="/pest-control-services/" className="hover:text-ink-600 transition-colors duration-150 text-decoration-none">Pest Control</Link></li>
                <li><span aria-hidden="true">•</span></li>
                <li aria-current="page" className="text-ink-600 font-medium">Service Details</li>
              </ol>
            </nav>

            {/* 1. Eyebrow Reveal */}
            <SectionReveal disabled>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F3A00] text-white text-sm sm:text-base font-medium border border-[#E5FBC9]">
                <Sparkles className="w-4 h-4 text-white shrink-0" />
                <span>{badge}</span>
              </div>
            </SectionReveal>

            {/* 2. H1 Masked Reveal */}
            <MaskedText as="h1" disabled className="font-heading text-4xl sm:text-5xl lg:text-[48px] font-medium text-ink-900 tracking-tight leading-[1.15]">
              {title}
            </MaskedText>

            {/* 3. Supporting Paragraph */}
            <SectionReveal disabled>
              <p className="text-lg text-ink-500 leading-relaxed max-w-xl font-normal">
                {description}
              </p>
            </SectionReveal>

            {/* 4. CTA / Estimate Input */}
            <SectionReveal disabled className="space-y-3 max-w-xl">
              <div className="p-1.5 sm:p-2 rounded-[16px] sm:rounded-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white border border-[#B7F56A]">
                <input 
                  type="text" 
                  placeholder="Enter property postcode or bedrooms" 
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-transparent text-sm sm:text-base text-ink-900 placeholder:text-ink-400 focus:outline-none font-normal text-start"
                />
                <ButtonLink href="#calculator" variant="primary" className="w-full sm:w-auto text-center whitespace-nowrap shrink-0 font-medium">
                  Get Estimate
                </ButtonLink>
              </div>

              <div className="text-base text-ink-500 font-normal ps-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1F3A00] inline-block"></span>
                <span>{guaranteeText} • {coverageText}</span>
              </div>
            </SectionReveal>

            {/* 5. Metrics Cards Stagger */}
            <StaggerGrid disabled className="pt-4 grid grid-cols-3 gap-3" staggerDelay={0.07}>
              <StaggerItem className="bg-[#F9FCF5] rounded-[16px] p-4 border border-[#B7F56A] text-start space-y-0.5">
                <div className="font-heading text-xl sm:text-2xl font-medium text-ink-900">{startingPrice}</div>
                <div className="text-base text-ink-500 font-medium">{startingPriceLabel}</div>
              </StaggerItem>
              <StaggerItem className="bg-[#F9FCF5] rounded-[16px] p-4 border border-[#B7F56A] text-start space-y-0.5">
                <div className="font-heading text-xl sm:text-2xl font-medium text-ink-900">48 Hours</div>
                <div className="text-base text-ink-500 font-medium">Re-Clean Support</div>
              </StaggerItem>
              <StaggerItem className="bg-[#F9FCF5] rounded-[16px] p-4 border border-[#B7F56A] text-start space-y-0.5">
                <div className="font-heading text-xl sm:text-2xl font-medium text-ink-900">London</div>
                <div className="text-base text-ink-500 font-medium">Service Coverage</div>
              </StaggerItem>
            </StaggerGrid>
          </div>

          {/* Right Column: Image Reveal */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {illustrationSlug ? (
              <div className="relative z-10 h-[360px] w-full overflow-hidden rounded-[28px] bg-[#eef3ff] sm:h-[440px]">
                <AnimatedIllustration
                  slug={illustrationSlug}
                  alt={heroImageAlt}
                  className="object-contain"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <ImageReveal disabled
                src={heroImage}
                alt={heroImageAlt}
                className="w-full h-[360px] sm:h-[440px] object-contain relative z-10"
              />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
