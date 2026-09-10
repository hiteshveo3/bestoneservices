"use client";

import { Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { classifyPageIntent } from "@/lib/page-intent";

export interface PageFinalCTAProps {
  pathname: string;
  customHeading?: string;
  customDescription?: string;
}

export function PageFinalCTA({
  pathname,
  customHeading,
  customDescription,
}: PageFinalCTAProps) {
  const intent = classifyPageIntent(pathname);

  let defaultHeading = "Ready to Book Your Service?";
  let defaultDesc = "Get an upfront estimate and book your date with our verified service guarantee.";

  if (pathname.includes("end-of-tenancy")) {
    defaultHeading = "Ready for a Stress-Free Move-Out Clean?";
    defaultDesc = "Get a flat-rate estimate based on your property size, backed by our 48-hour re-clean guarantee.";
  } else if (pathname.includes("pest")) {
    defaultHeading = "Ready to Eradicate Your Pest Problem?";
    defaultDesc = "Select your treatment package and schedule your BPCA-certified technician visit.";
  } else if (pathname.includes("gardening")) {
    defaultHeading = "Ready to Get Your Garden Sorted?";
    defaultDesc = "Book our 2-gardener team for maintenance, pruning, or green waste clearance.";
  } else if (pathname.includes("removals")) {
    defaultHeading = "Planning Your House Move?";
    defaultDesc = "Select your moving team and vehicle configuration for reliable London transport.";
  } else if (intent.type === "location") {
    defaultHeading = "Need Professional Property Care in Your Area?";
    defaultDesc = "Check local availability and calculate your service price in seconds.";
  } else if (intent.type === "guide") {
    defaultHeading = "Need Professional Help With Your Property?";
    defaultDesc = "Explore our transparent starting rates or calculate your custom estimate.";
  }

  const heading = customHeading || defaultHeading;
  const description = customDescription || defaultDesc;

  return (
    <section className="pb-16">
      <div className="brand-cta-section p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/12 text-white text-xs sm:text-sm font-medium tracking-wider backdrop-blur-xs border border-white/30">
          <Sparkles className="w-4 h-4 text-white shrink-0" />
          <span>{intent.primaryCtaText.toUpperCase()}</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight max-w-3xl mx-auto text-white">
          {heading}
        </h2>

        <p className="text-lg text-white/90 max-w-xl mx-auto font-normal">
          {description}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <ButtonLink href={intent.bookButtonHref} variant="white" className="w-full sm:w-auto">
            {intent.primaryCtaText}
          </ButtonLink>
          <ButtonLink href="/contact/" variant="glass" className="w-full sm:w-auto" showArrow={false}>
            Contact Support Team
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
