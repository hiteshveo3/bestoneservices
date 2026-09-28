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
import { buttonClass, SlimCta } from "@/components/touchstone";

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
    <main id="main-content" className="space-y-20 bg-paper text-start text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* 1. HERO — two weights, and the four starting prices as record rows (S17 / S24 A) */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 pt-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pt-12">
          <div className="grid content-start gap-5">
            <p className="ts-eyebrow m-0">Fixed prices, confirmed before we arrive</p>
            <h1 className="ts-head m-0 text-[clamp(38px,5vw,60px)] leading-none">
              Every price we charge, <span className="ts-soft">on one page.</span>
            </h1>
            <p className="m-0 max-w-[56ch] text-lg text-muted">
              Browse the fixed rates for cleaning, pest control, gardening and removals, or build an itemised price for your property in under a minute.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="#smart-calculator" className={buttonClass("primary", "lg")}>Calculate my price</Link>
              <Link href="#rates" className={buttonClass("white", "lg")}>Browse all rates</Link>
            </div>
          </div>
          <div className="grid content-start gap-2.5 rounded-3xl bg-white p-4 sm:p-5">
            <p className="ts-eyebrow m-0 px-1.5">Starting prices</p>
            <ul className="ts-rows m-0 list-none p-0">
              {chips.map((chip) => (
                <li key={chip.label} className="flex items-baseline justify-between gap-3 px-3.5 py-3">
                  <span className="font-semibold">{chip.label}</span>
                  <span className="ts-fig text-[26px]">{chip.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 2. HOW THIS PAGE WORKS — orientation strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:gap-10 sm:grid-cols-3 py-6 border-[#ECEAE3]">
          <p className="ts-eyebrow m-0">How this page works</p>
          <p className="text-base text-[#1D201E]/70 leading-relaxed sm:col-span-2 m-0">
            Rates below are fixed, not estimates. Pick a category to see its full price list, or use the calculator to add your property size and any extras — it shows the itemised total, not just a final number.
          </p>
        </div>
      </section>

      {/* 3. QUOTE CALCULATOR — centerpiece */}
      <section id="smart-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="space-y-2 pb-7">
          <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#1D201E]/60 m-0">Quote calculator</p>
          <h2 className="font-heading font-[650] text-[clamp(1.75rem,3.4vw,2.6rem)] leading-tight tracking-tight text-[#1D201E] max-w-[24ch] m-0">
            Build your exact price
          </h2>
        </div>
        <Suspense fallback={<div className="p-8 text-center bg-white rounded-[24px] ">Loading pricing engine…</div>}>
          <InstantEstimator />
        </Suspense>
      </section>

      {/* 4. WHY THESE NUMBERS HOLD — consolidated trust section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3 items-start py-10 border-[#ECEAE3]">
          <div className="space-y-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#1D201E]/60 m-0">Why these numbers hold</p>
            <h2 className="font-heading font-[650] text-[clamp(1.6rem,3.2vw,2.4rem)] leading-tight tracking-tight text-[#1D201E] m-0">
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
                <span className="flex shrink-0 items-center justify-center w-[38px] h-[38px] rounded-full bg-[#EAF8D6] ">
                  <row.icon className="w-[18px] h-[18px] text-[#1D201E]" />
                </span>
                <div className="space-y-1">
                  <strong className="font-semibold text-base text-[#1D201E]">{row.title}</strong>
                  <p className="text-sm text-[#1D201E]/70 leading-relaxed m-0">{row.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FULL RATE CARD — tab-filtered, one category visible at a time */}
      <section id="rates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="space-y-2 pb-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#1D201E]/60 m-0">Full rate card</p>
          <h2 className="font-heading font-[650] text-[clamp(1.75rem,3.4vw,2.6rem)] leading-tight tracking-tight text-[#1D201E] max-w-[26ch] m-0">
            Every rate, by category
          </h2>
        </div>
        <RateTabs />
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#1D201E]/60 m-0">Questions</p>
          <h2 className="font-heading font-[650] text-3xl text-[#1D201E] m-0">Before you book</h2>
          <p className="text-base text-[#1D201E]/70 m-0">Something not covered here? Ask us directly — we answer with a number, not a range.</p>
        </div>
        <FaqAccordion items={PRICING_FAQS} />
      </section>

      {/* 7. S58 A · the slim closing band */}
      <section className="mx-auto max-w-[1240px] px-4 pb-16 sm:px-6 lg:px-8">
        <SlimCta title="Your number in under a minute." soft="Nothing to commit to." action={<Link href="#smart-calculator" className={buttonClass("primary")}>Calculate my price</Link>} />
      </section>
    </main>
  );
}
