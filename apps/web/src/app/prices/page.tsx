"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  SprayCan,
  Trees,
  Truck,
  Check,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Info,
  Award
} from "lucide-react";
import { masterPricingData, PRICING_LAST_UPDATED } from "@/config/pricing-data";
import { generatePricingPageSchema } from "@/lib/pricing-schema";
import { PricePromiseBadge } from "@/components/ui/price-promise-badge";
import { InstantEstimator } from "@/components/ui/calculator";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { HeroPricing } from "@/components/hero";
import { SitewideIllustrationGrid } from "@/components/illustrations/sitewide-illustration-grid";

export default function PricingPage() {
  const [selectedCategory, setSelectedCategory] = useState<"cleaning" | "pest-control" | "gardening" | "removals">("cleaning");

  const FAQ_DATA = [
    {
      q: "How are End of Tenancy cleaning prices calculated?",
      a: "End of Tenancy cleaning is calculated on a fixed flat-rate basis according to property size (e.g., Studio £130, 1 Bed £200, 2 Bed £230, 3 Bed £300, 4 Bed £350). All packages include our 48-Hour Re-Clean Guarantee.",
    },
    {
      q: "What is included in Pest Control visit packages?",
      a: "Pest control packages are calculated by property size and infestation level. Single visit treatments start at £90–£120; 2-visit packages (£160–£190) include a 1-month written guarantee; 3-visit packages (£210–£230) include a 3-month written guarantee.",
    },
    {
      q: "How does Gardening team pricing work?",
      a: "Gardening maintenance uses a 2-gardener team model charged at £70 for the first hour and £50 for each additional hour, with a £70 minimum charge. Waste removal is billed at £5 per standard bag or £50 per jumbo bag.",
    },
    {
      q: "What are the rates for Man & Van Removals?",
      a: "Removals start at £80–£120 per hour for 2 Men + 1 Luton Van (minimum £160/2 hours) or £120–£160 per hour for 3 Men + Large Van. Full packing is £30/hr standard or £25/hr for Best One Club members.",
    },
  ];

  const schema = generatePricingPageSchema();

  return (
    <main id="main-content" className="space-y-16 text-start">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* 1. REFINED INFORMATION-LED PRICING HERO */}
      <HeroPricing />

      <SitewideIllustrationGrid
        eyebrow="Clear from quote to confirmation"
        title="Pricing and booking without the guesswork"
        cards={[
          { slug: "quote-calculator", title: "Instant Estimate", description: "Build an initial estimate from the service and property details you provide.", href: "#calculator", imageSrc: "/images/feature-quote-booking-blue-v1.png", imageAlt: "Customer selecting a service quote and booking time" },
          { slug: "secure-payment", title: "Secure Checkout", description: "Review the confirmed scope before completing the booking payment.", href: "/booking/" },
          { slug: "easy-scheduling", title: "Choose a Suitable Time", description: "Select the preferred date and provide access information for confirmation.", href: "/booking/" },
        ]}
      />

      {/* 2. SERVICE CATEGORY SELECTOR CHIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-8">
          <h2 className="font-heading text-2xl font-medium text-[#1F3A00]">Select Service Category To Explore Rates</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: "cleaning", label: "Cleaning", icon: Sparkles },
              { id: "pest-control", label: "Pest Control", icon: SprayCan },
              { id: "gardening", label: "Gardening", icon: Trees },
              { id: "removals", label: "Removals & Storage", icon: Truck },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as "cleaning" | "pest-control" | "gardening" | "removals")}
                  className={`px-6 py-3.5 rounded-full text-base font-semibold flex items-center gap-2.5 transition-colors duration-150 cursor-pointer border ${ isActive ? "bg-[#B7F56A] text-[#1F3A00] font-bold border-[#99D055] shadow-2xs" : "bg-[#F9FCF5] text-[#1F3A00]/70 border-[#E5FBC9] hover:bg-[#DCFAB7]/40" }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#1F3A00]" : "text-[#1F3A00]/60"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3 - 6. DETAILED VERTICAL PRICING SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <AnimatePresence mode="wait">
          {Object.values(masterPricingData).map((cat) => {
            if (cat.id !== selectedCategory) return null;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-10"
              >

              {/* Category Header Card */}
              <div className="bg-white rounded-[24px] p-8 border border-[#B7F56A] shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="px-3.5 py-1 rounded-full bg-[#DCFAB7] text-[#1F3A00] text-xs font-mono font-semibold uppercase tracking-wider">
                    {cat.badge}
                  </span>
                  <span className="font-mono text-base font-semibold text-[#1F3A00] bg-[#DCFAB7] px-4 py-1.5 rounded-full border border-[#99D055]">
                    {cat.startingRateDisplay}
                  </span>
                </div>
                <h2 className="font-heading text-3xl font-medium text-[#1F3A00]">{cat.title}</h2>
                <p className="text-base text-[#1F3A00]/60 max-w-3xl leading-relaxed">{cat.description}</p>

                <PricePromiseBadge variant={cat.pricingType === "property_size" ? "fixed" : "range"} />

                {/* Honest market anchoring — sourced from pricing-data.ts */}
                <p className="text-base text-[#1F3A00]/85 max-w-3xl leading-relaxed bg-[#DCFAB7]/40 border border-[#E5FBC9] rounded-[16px] p-4">
                  {cat.marketContext}{" "}
                  <Link
                    href="/about/our-pricing/"
                    className="font-semibold text-[#1F3A00] hover:underline hover:underline-offset-2 transition-colors duration-150"
                  >
                    Wondering how we keep prices this fair? →
                  </Link>
                </p>

                <div className="pt-2 text-base font-mono text-[#1F3A00]/60 flex flex-wrap gap-4 border-t border-[#E5FBC9] pt-4">
                  <span>ℹ️ {cat.minChargeText}</span>
                  <span>🛡️ {cat.guaranteeText}</span>
                  <span>🗓️ Prices last updated: {PRICING_LAST_UPDATED}</span>
                </div>
              </div>

              {/* Pricing Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.variants.map((v) => (
                  <div key={v.id} className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#B7F56A] shadow-2xs space-y-4 flex flex-col justify-between hover:border-[#1F3A00] transition-colors duration-150">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-heading text-lg font-medium text-[#1F3A00]">{v.name}</h3>
                        {v.propertySize && (
                          <span className="px-3 py-1 rounded-full bg-[#F9FCF5] text-[#1F3A00]/70 text-xs font-mono font-medium border border-[#E5FBC9]">
                            {v.propertySize}
                          </span>
                        )}
                      </div>

                      <div className="pt-1">
                        <div className="font-heading text-3xl font-medium text-[#1F3A00]">
                          £{v.startingPrice}{v.maxPrice ? `–£${v.maxPrice}` : ""}
                        </div>
                        {v.unit && <div className="text-base text-[#1F3A00]/60 font-mono">{v.unit}</div>}
                      </div>

                      {v.guarantee && (
                        <div className="inline-block px-3 py-1 rounded-full bg-[#F9FCF5] text-[#1F3A00] text-xs font-semibold border border-[#E5FBC9]">
                          🛡️ {v.guarantee}
                        </div>
                      )}

                      <ul className="space-y-2 text-base text-[#1F3A00]/60 pt-3 border-t border-[#E5FBC9] list-none p-0">
                        {v.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#1F3A00] shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href="/booking/"
                      className="w-full px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2 text-decoration-none cursor-pointer"
                    >
                      <span>Book This Rate</span>
                      <ArrowRight className="w-4 h-4 text-[#1F3A00]" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Semantic quick-reference table — same data as the cards above, in
                  genuine <table> markup for search/AI crawlers that parse tables
                  more reliably than styled divs. Visually compact; the cards
                  remain the primary human-facing UI. */}
              <div className="overflow-x-auto border border-[#E5FBC9] rounded-[20px] bg-white">
                <table className="w-full min-w-[500px] border-collapse text-left text-sm">
                  <caption className="sr-only">{cat.title} — full rate list</caption>
                  <thead>
                    <tr className="bg-[#DCFAB7] text-[#1F3A00]">
                      <th scope="col" className="p-3.5 sm:p-4 font-semibold">Package</th>
                      <th scope="col" className="p-3.5 sm:p-4 font-semibold">Price</th>
                      <th scope="col" className="p-3.5 sm:p-4 font-semibold">Unit</th>
                      <th scope="col" className="p-3.5 sm:p-4 font-semibold">Guarantee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5FBC9] text-[#1F3A00]">
                    {cat.variants.map((v) => (
                      <tr key={v.id}>
                        <th scope="row" className="p-3.5 sm:p-4 font-semibold text-start">{v.name}</th>
                        <td className="p-3.5 sm:p-4 font-medium">£{v.startingPrice}{v.maxPrice ? `–£${v.maxPrice}` : ""}</td>
                        <td className="p-3.5 sm:p-4">{v.unit ?? "—"}</td>
                        <td className="p-3.5 sm:p-4">{v.guarantee ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add-ons & Surcharges Box */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#B7F56A] shadow-2xs space-y-3">
                  <h4 className="font-heading text-lg font-medium text-[#1F3A00]">Optional Add-ons & Service Extras</h4>
                  <ul className="space-y-2 text-base text-[#1F3A00]/60 list-none p-0">
                    {cat.addOns.map((add, i) => (
                      <li key={i} className="flex justify-between items-center py-1 border-b border-[#E5FBC9]">
                        <span>{add.name}</span>
                        <span className="font-mono font-medium text-[#1F3A00]/85">{add.priceDisplay}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#B7F56A] shadow-2xs space-y-3">
                  <h4 className="font-heading text-lg font-medium text-[#1F3A00]">Key Cost Factors</h4>
                  <ul className="space-y-2 text-base text-[#1F3A00]/60 list-none p-0">
                    {cat.factorsAffectingPrice.map((factor, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-[#1F3A00]/60 shrink-0 mt-0.5" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </section>

      {/* 7. SMART PRICE CALCULATOR */}
      <section id="smart-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="p-8 text-center bg-white rounded-[24px] border border-[#B7F56A]">Loading Pricing Engine...</div>}>
          <InstantEstimator />
        </Suspense>
      </section>

      {/* 8. HOW OUR PRICING WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-[24px] p-8 sm:p-10 border border-[#B7F56A] shadow-2xs space-y-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-medium text-[#1F3A00]">How Our Pricing Engine Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#1F3A00] text-[#B7F56A] flex items-center justify-center font-semibold font-mono text-base">1</div>
              <h3 className="font-heading text-lg font-medium text-[#1F3A00]">Deterministic Calculation</h3>
              <p className="text-base text-[#1F3A00]/60">Prices are computed using fixed algorithms and verified rates rather than random AI estimations.</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#1F3A00] text-[#B7F56A] flex items-center justify-center font-semibold font-mono text-base">2</div>
              <h3 className="font-heading text-lg font-medium text-[#1F3A00]">Zero Hidden Surcharges</h3>
              <p className="text-base text-[#1F3A00]/60">All minimum charges, waste fees, and night slot surcharges are clearly declared upfront.</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#1F3A00] text-[#B7F56A] flex items-center justify-center font-semibold font-mono text-base">3</div>
              <h3 className="font-heading text-lg font-medium text-[#1F3A00]">Written Guarantees</h3>
              <p className="text-base text-[#1F3A00]/60">Every package details its exact guarantee duration (48-hour re-clean, 1-month pest, or 3-month pest guarantee).</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. WHAT CAN CHANGE YOUR FINAL PRICE? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[24px] p-8 sm:p-10 border border-[#B7F56A] shadow-2xs space-y-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-medium text-[#1F3A00]">What Can Change Your Final Price?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-base text-[#1F3A00]/60">
            <div className="space-y-2">
              <h3 className="font-heading text-lg font-medium text-[#1F3A00]">Property Size & Extra Rooms</h3>
              <p>Unusually large properties (e.g., additional conservatories, basements, or extra ensuite bathrooms) are adjusted according to actual room count.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-lg font-medium text-[#1F3A00]">Specialized Waste or Heavy Buildup</h3>
              <p>Heavy garden clearance or severe infestation proofing requiring custom structural timber/mesh will be estimated before work begins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. GUARANTEES & POLICIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[24px] p-8 border border-[#B7F56A] shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#DCFAB7] flex items-center justify-center font-medium">
              <ShieldCheck className="w-6 h-6 text-[#1F3A00]" />
            </div>
            <h3 className="font-heading text-xl font-medium text-[#1F3A00]">48-Hour Re-Clean Guarantee</h3>
            <p className="text-base text-[#1F3A00]/60">
              If your landlord or letting agent raises any cleaning concerns within 48 hours of completion, our team re-cleans those items free of charge.
            </p>
          </div>

          <div className="bg-white rounded-[24px] p-8 border border-[#B7F56A] shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#DCFAB7] flex items-center justify-center font-medium">
              <Award className="w-6 h-6 text-[#1F3A00]" />
            </div>
            <h3 className="font-heading text-xl font-medium text-[#1F3A00]">1 to 3 Month Pest Clearance Warranty</h3>
            <p className="text-base text-[#1F3A00]/60">
              Multi-visit pest treatment packages include formal written warranties. If pests return during the guarantee window, we re-treat for free.
            </p>
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase bg-[#DCFAB7] text-[#1F3A00]">
            <HelpCircle className="w-4 h-4 text-[#1F3A00]" />
            <span>Pricing FAQs</span>
          </div>
          <h2 className="font-heading text-3xl font-medium text-[#1F3A00]">Frequently Asked Pricing Questions</h2>
        </div>

        <FaqAccordion items={FAQ_DATA} />
      </section>

      {/* 12. FINAL BRAND CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="brand-cta-section p-8 sm:p-14 text-center space-y-6 relative overflow-hidden rounded-[28px]">
          {/* Lime accent stripe */}
          <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B7F56A]" aria-hidden="true" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DCFAB7] text-[#1F3A00] text-sm font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#1F3A00]" />
            <span>CLEAR PRICING • GUARANTEED SERVICE</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight max-w-3xl mx-auto text-[#1F3A00]">
            Ready to Book Your Service?
          </h2>

          <p className="text-lg text-[#1F3A00]/80 max-w-xl mx-auto font-normal">
            Get an instant deterministic estimate and confirm your booking in under 2 minutes.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/booking/"
              className="px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2 text-decoration-none cursor-pointer w-full sm:w-auto"
            >
              <span>Get Instant Quote</span>
              <ArrowRight className="w-5 h-5 text-[#1F3A00]" />
            </Link>
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-white border border-[#B7F56A] text-[#1F3A00] hover:opacity-90 transition-opacity duration-200 text-decoration-none cursor-pointer w-full sm:w-auto"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
