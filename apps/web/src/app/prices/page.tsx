"use client";

import { Suspense } from "react";
import Link from "next/link";
import { List, Layers, XCircle } from "lucide-react";
import { generatePricingPageSchema } from "@/lib/pricing-schema";
import { InstantEstimator } from "@/components/ui/calculator";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { RateTabs } from "@/components/ui/rate-tabs";
import { getCalculatorConfig } from "@/config/pricing-calculator-config";
import { PRICING_FAQS } from "@/config/pricing-faqs";

export default function PricingPage() {
  const schema = generatePricingPageSchema();
  const config = getCalculatorConfig();
  const chips = [
    { label: "Cleaning", value: config.cleaning.fromNote },
    { label: "Pest control", value: config.pest.fromNote },
    { label: "Gardening", value: config.gardening.fromNote },
    { label: "Removals", value: config.removals.fromNote },
  ];

  return (
    <main id="main-content" className="space-y-24 text-start">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* 1. HERO — single centered column */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 text-center flex flex-col items-center gap-6">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCFAB7] border border-[#99D055] font-mono text-[11px] font-medium uppercase tracking-wider text-[#1F3A00]">
          Fixed prices · confirmed before we arrive
        </span>
        <h1 className="font-heading font-semibold text-[clamp(2.4rem,5.6vw,4rem)] leading-[1.02] tracking-tight text-[#1F3A00] max-w-[19ch]">
          Every price we charge, on one page.
        </h1>
        <p className="text-lg text-[#1F3A00]/70 leading-relaxed max-w-[56ch]">
          Browse our fixed rates for cleaning, pest control, gardening and removals — or build an itemised quote for your exact property in under a minute.
        </p>
        <div className="flex flex-col items-center gap-3 pt-1">
          <Link
            href="#smart-calculator"
            className="inline-flex items-center h-[54px] px-8 rounded-md font-inter text-base font-bold bg-[#B7F56A] text-[#1F3A00] hover:opacity-90 transition-opacity duration-200"
          >
            Calculate my price
          </Link>
          <Link href="#rates" className="text-sm font-medium text-[#1F3A00]/70 hover:text-[#1F3A00] hover:underline underline-offset-2">
            or browse all rates
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5 pt-4">
          {chips.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-baseline gap-2 px-4 py-2 rounded-full bg-white border border-[#E5FBC9] text-sm text-[#1F3A00]"
            >
              {chip.label} <span className="font-mono font-bold">{chip.value}</span>
            </span>
          ))}
        </div>
      </section>

      {/* 2. HOW THIS PAGE WORKS — orientation strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:gap-10 sm:grid-cols-3 py-6 border-t border-b border-[#E5FBC9]">
          <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#1F3A00]/60 m-0">How this page works</p>
          <p className="text-base text-[#1F3A00]/70 leading-relaxed sm:col-span-2 m-0">
            Rates below are fixed, not estimates. Pick a category to see its full price list, or use the calculator to add your property size and any extras — it shows the itemised total, not just a final number.
          </p>
        </div>
      </section>

      {/* 3. QUOTE CALCULATOR — centerpiece */}
      <section id="smart-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="space-y-2 pb-7">
          <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#1F3A00]/60 m-0">Quote calculator</p>
          <h2 className="font-heading font-semibold text-[clamp(1.75rem,3.4vw,2.6rem)] leading-tight tracking-tight text-[#1F3A00] max-w-[24ch] m-0">
            Build your exact price
          </h2>
        </div>
        <Suspense fallback={<div className="p-8 text-center bg-white rounded-[24px] border border-[#E5FBC9]">Loading pricing engine…</div>}>
          <InstantEstimator />
        </Suspense>
      </section>

      {/* 4. WHY THESE NUMBERS HOLD — consolidated trust section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3 items-start py-10 border-t border-[#E5FBC9]">
          <div className="space-y-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#1F3A00]/60 m-0">Why these numbers hold</p>
            <h2 className="font-heading font-semibold text-[clamp(1.6rem,3.2vw,2.4rem)] leading-tight tracking-tight text-[#1F3A00] m-0">
              The price you calculate is the price you pay.
            </h2>
          </div>
          <div className="sm:col-span-2 space-y-7">
            {[
              {
                icon: List,
                title: "Calculated, not estimated",
                body: "Every quote is built from the same published rate card you can read above. Same inputs, same number, every time — no surveyor discretion, no upward revision on the day.",
              },
              {
                icon: Layers,
                title: "Written guarantees, with durations",
                body: "End of tenancy cleans carry a 48-hour re-clean if your agent raises an issue. Pest treatments carry a 1–3 month warranty depending on the treatment. Both are stated on your booking confirmation, not just on this page.",
              },
              {
                icon: XCircle,
                title: "Nothing added afterwards",
                body: "No congestion or parking surcharge inside our coverage area, no VAT added at checkout, no callout fee layered on top of an hourly rate. If a job genuinely needs more time than quoted, we tell you before starting, not after.",
              },
            ].map((row) => (
              <div key={row.title} className="flex gap-4">
                <span className="flex shrink-0 items-center justify-center w-[38px] h-[38px] rounded-full bg-[#DCFAB7] border border-[#99D055]">
                  <row.icon className="w-[18px] h-[18px] text-[#1F3A00]" />
                </span>
                <div className="space-y-1">
                  <strong className="font-semibold text-base text-[#1F3A00]">{row.title}</strong>
                  <p className="text-sm text-[#1F3A00]/70 leading-relaxed m-0">{row.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FULL RATE CARD — tab-filtered, one category visible at a time */}
      <section id="rates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="space-y-2 pb-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#1F3A00]/60 m-0">Full rate card</p>
          <h2 className="font-heading font-semibold text-[clamp(1.75rem,3.4vw,2.6rem)] leading-tight tracking-tight text-[#1F3A00] max-w-[26ch] m-0">
            Every rate, by category
          </h2>
        </div>
        <RateTabs />
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#1F3A00]/60 m-0">Questions</p>
          <h2 className="font-heading font-semibold text-3xl text-[#1F3A00] m-0">Before you book</h2>
          <p className="text-base text-[#1F3A00]/70 m-0">Something not covered here? Ask us directly — we answer with a number, not a range.</p>
        </div>
        <FaqAccordion items={PRICING_FAQS} />
      </section>

      {/* 7. FINAL CTA — white card, centered, single button */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-[24px] p-10 sm:p-16 border border-[#E5FBC9] shadow-2xs flex flex-col items-center text-center gap-4">
          <h2 className="font-heading font-semibold text-[clamp(1.75rem,3.6vw,2.75rem)] leading-tight tracking-tight text-[#1F3A00] max-w-[24ch] m-0">
            Get your number in under a minute.
          </h2>
          <p className="text-base text-[#1F3A00]/70 max-w-[52ch] m-0">
            Pick your service, add your property details, and see the itemised total before you commit to anything.
          </p>
          <Link
            href="#smart-calculator"
            className="mt-2 inline-flex items-center h-[54px] px-8 rounded-md font-inter text-base font-bold bg-[#B7F56A] text-[#1F3A00] hover:opacity-90 transition-opacity duration-200"
          >
            Calculate my price
          </Link>
        </div>
      </section>
    </main>
  );
}
