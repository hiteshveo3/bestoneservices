import type { Metadata } from "next";
import Link from "next/link";
import { Trees, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { SmartPricingCTA } from "@/components/service/smart-pricing-cta";
import { InstantEstimator } from "@/components/ui/calculator";
import { ButtonLink } from "@/components/button-link";

export const metadata: Metadata = {
  title: "Professional Gardening & Garden Clearance Services",
  description: "Expert garden maintenance, lawn mowing, pressure washing and garden clearance with transparent hourly pricing across Greater London.",
  alternates: { canonical: "/gardening/" },
};

export default function GardeningPage() {
  return (
    <main className="space-y-16 py-10 text-start">
      {/* Canvas Page Header Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="space-y-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DCFAB7] text-[#1F3A00] text-xs font-mono font-semibold uppercase border border-[#E5FBC9]">
            <Trees className="w-4 h-4 text-[#1F3A00]" />
            <span>GARDENING & CLEARANCE VERTICAL</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-medium text-ink-900 tracking-tight leading-tight">
            Professional Garden Maintenance & Waste Clearance
          </h1>

          <p className="text-lg sm:text-xl text-ink-500 max-w-2xl mx-auto font-normal leading-relaxed">
            Transparent 2-gardener team pricing from £70/first hour (£50/additional hour). Includes lawn mowing, hedge trimming, weed clearance, and pressure washing.
          </p>

          <div className="pt-2 flex justify-center">
            <ButtonLink href="/booking/" variant="dark">
              Book Gardening Team
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Smart Pricing CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SmartPricingCTA 
          title="Calculate Your Gardening & Clearance Cost"
          subtitle="Select hours, 2-gardener team, and waste disposal options to calculate your rate."
          buttonText="Calculate Gardening Price"
          category="gardening"
          serviceId="gardening-main"
        />
      </section>

      {/* Instant Calculator — embedded inline, not hidden behind /prices/ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InstantEstimator defaultVertical="gardening" />
      </section>

      {/* Feature Grid (White Cards on Canvas) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#F9FCF5] rounded-[24px] p-6 sm:p-8 border border-[#B7F56A] shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#DCFAB7] flex items-center justify-center font-medium">
              <Trees className="w-6 h-6 text-[#1F3A00]" />
            </div>
            <h3 className="font-heading text-xl font-medium text-ink-900">2-Gardener Team</h3>
            <p className="text-base text-ink-500 leading-relaxed">
              Every session includes two experienced gardeners equipped with commercial mowers, trimmers, and blowers.
            </p>
          </div>

          <div className="bg-[#F9FCF5] rounded-[24px] p-6 sm:p-8 border border-[#B7F56A] shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#DCFAB7] flex items-center justify-center font-medium">
              <Clock className="w-6 h-6 text-[#1F3A00]" />
            </div>
            <h3 className="font-heading text-xl font-medium text-ink-900">Transparent Hourly Rates</h3>
            <p className="text-base text-ink-500 leading-relaxed">
              First hour £70, additional hours £50 with zero hidden fees. Minimum booking applies.
            </p>
          </div>

          <div className="bg-[#F9FCF5] rounded-[24px] p-6 sm:p-8 border border-[#B7F56A] shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#DCFAB7] flex items-center justify-center font-medium">
              <ShieldCheck className="w-6 h-6 text-[#1F3A00]" />
            </div>
            <h3 className="font-heading text-xl font-medium text-ink-900">Licensed Waste Removal</h3>
            <p className="text-base text-ink-500 leading-relaxed">
              Full green waste removal in standard (£5) or jumbo bags (£50) with environmentally safe disposal.
            </p>
          </div>
        </div>
      </section>

      {/* Final Brand CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="brand-cta-section p-8 sm:p-14 text-center space-y-6 relative overflow-hidden rounded-[28px] border border-[#3A5C13]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DCFAB7] text-[#1F3A00] text-base font-mono font-medium uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#1F3A00]" />
            <span>EXPERT GARDENING & LANDSCAPING</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight max-w-3xl mx-auto text-[#F9FCF5]">
            Ready to Refresh Your Garden Space?
          </h2>

          <p className="text-lg text-[#DFFBBC] max-w-xl mx-auto font-normal">
            Book our 2-gardener team with transparent hourly rates and instant booking confirmation.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <ButtonLink href="/booking/" variant="white" className="w-full sm:w-auto">
              Get Instant Quote Now
            </ButtonLink>
            <ButtonLink href="/contact/" variant="outline" className="w-full sm:w-auto" showArrow={false}>
              Contact Support Team
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
