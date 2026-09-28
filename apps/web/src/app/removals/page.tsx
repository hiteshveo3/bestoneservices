import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Truck, Sparkles, Award } from "lucide-react";
import { SmartPricingCTA } from "@/components/service/smart-pricing-cta";
import { InstantEstimator } from "@/components/ui/calculator";
import { ButtonLink } from "@/components/button-link";
import { siteContact } from "@/config/site-contact";

export const metadata: Metadata = {
  title: "Professional Home & Office Removals",
  description: "Reliable home and office removals, man & van, and packing services across London. Special rates available for Bestone Club members.",
  alternates: { canonical: "/removals/" },
};

export default function RemovalsPage() {
  return (
    <main className="space-y-16 py-10 text-start">
      {/* Canvas Header Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="space-y-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EAF8D6] text-[#1D201E] text-xs font-mono font-semibold uppercase border border-[#ECEAE3]">
            <Truck className="w-4 h-4 text-[#1D201E]" />
            <span>REMOVALS & STORAGE VERTICAL</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-medium text-ink-900 tracking-tight leading-tight">
            Home & Office Removals, Man & Van Services
          </h1>

          <p className="text-lg sm:text-xl text-ink-500 max-w-2xl mx-auto font-normal leading-relaxed">
            Professional moving teams (2 or 3 men + van) from £80–£120/hr. Full packing, protective wrapping, and special Bestone Club member rates available.
          </p>

          <div className="pt-2 flex justify-center items-center gap-4">
            <ButtonLink href={siteContact.getWhatsappUrl("Hi, I'd like to book a move team with Bestone Services.")} variant="dark">
              Book Move Team
            </ButtonLink>
          </div>

          <div className="pt-4 flex justify-center">
            <div className="relative max-w-lg w-full bg-[#F6F5F1] rounded-[24px] p-6 border border-[#ECEAE3] ">
              <Image
                src="/images/man-with-van.png"
                alt="Professional Bestone Man with a Van removal team"
                width={1448}
                height={1086}
                className="w-full h-auto max-h-72 object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Smart Pricing CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SmartPricingCTA 
          title="Estimate Your Moving & Removal Cost"
          subtitle="Choose team size (2 or 3 men), vehicle option, and estimated hours to calculate your moving cost."
          buttonText="Estimate My Move"
          category="removals"
          serviceId="removals-main"
        />
      </section>

      {/* Instant Calculator — embedded inline, not hidden behind /prices/ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InstantEstimator defaultVertical="removals" />
      </section>

      {/* Bestone Club Spotlight (White Card on Canvas) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white text-ink-700 rounded-[24px] p-8 sm:p-10 border-2 border-[#ECEAE3]  space-y-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAF8D6] text-[#1D201E] text-xs font-mono font-semibold uppercase">
              <Award className="w-4 h-4 text-[#1D201E]" />
              <span>BESTONE CLUB EXCLUSIVE</span>
            </div>
            <h3 className="font-heading text-2xl font-medium text-ink-900">Save £5/Hour On Packing Services</h3>
            <p className="text-base text-ink-500 max-w-xl leading-relaxed">
              Bestone Club members get exclusive discounted rates on packing services (£25/hr vs £30/hr standard) plus priority booking windows.
            </p>
          </div>

          <ButtonLink href={siteContact.getWhatsappUrl("Hi, I'd like to join the Bestone Club.")} variant="dark" className="shrink-0">
            Join Bestone Club
          </ButtonLink>
        </div>
      </section>

      {/* Final Brand CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="brand-cta-section p-8 sm:p-14 text-center space-y-6 relative overflow-hidden rounded-[28px] border border-[#ECEAE3]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF8D6] text-[#1D201E] text-base font-mono font-medium uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#1D201E]" />
            <span>SAFE & GUARANTEED REMOVALS</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight max-w-3xl mx-auto text-[#1D201E]">
            Ready to Move Property stress-free?
          </h2>

          <p className="text-lg text-[#1D201E] max-w-xl mx-auto font-normal">
            Book our 2 or 3-men team with protective Luton vans and upfront hourly rates.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <ButtonLink href={siteContact.getWhatsappUrl("Hi, I'd like an instant quote from Bestone Services.")} variant="white" className="w-full sm:w-auto">
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
