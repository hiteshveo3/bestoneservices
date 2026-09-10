"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Phone, 
  PhoneCall,
  ChevronDown, 
  ShieldCheck,
  Sparkles, 
  Building, 
  Layers, 
  CheckCircle2, 
  BadgeCheck, 
  ArrowLeft 
} from "lucide-react";

export default function TestPreviewPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);


  const scopeItems = [
    {
      icon: Sparkles,
      title: "Kitchen & Oven Degreasing",
      desc: "Full deep clean inside and outside of oven, extractor fan filters, hob, cupboards, sink descaling, and splashback tiles."
    },
    {
      icon: ShieldCheck,
      title: "Bathrooms & Descaling",
      desc: "Complete limescale removal from taps, shower screens, tiles, grout scrub, toilet sanitation, and mirror polishing."
    },
    {
      icon: Building,
      title: "Living Areas & Bedrooms",
      desc: "Skirting boards, doors, switches, sockets, cobweb removal, interior windows, and thorough vacuuming and mopping."
    },
    {
      icon: Layers,
      title: "Windows, Sills & Frames",
      desc: "Internal window glass cleaned streak-free, window frames, ledges, sills, and reachable blind dusting."
    },
    {
      icon: CheckCircle2,
      title: "Flooring & Carpet Deep Care",
      desc: "All floors vacuumed and mopped; optional hot water extraction commercial steam shampooing for heavy carpet marks."
    },
    {
      icon: BadgeCheck,
      title: "Appliances & White Goods",
      desc: "Fridge/freezer interior wipe-down (must be defrosted), washing machine soap drawers, and dishwasher filters."
    }
  ];

  const tenancyFaqs = [
    {
      q: "What is your 48-Hour Re-Clean Guarantee?",
      a: "If your landlord, inventory clerk, or letting agent flags any cleaning issues on their checkout report, notify us within 48 hours. Our team will return to the property and re-clean those specific items completely free of charge."
    },
    {
      q: "Is professional oven cleaning included in the price?",
      a: "Yes! Unlike many competitors who charge up to £60 extra for ovens, our standard End of Tenancy cleaning package includes a full deep oven clean (inside, racks, trays, glass, and exterior hob)."
    },
    {
      q: "Will you provide an official receipt for my letting agent?",
      a: "Yes. Upon completion, we provide an official itemized VAT invoice detailing the professional service performed. This serves as documented proof for your landlord and deposit protection schemes (TDS, DPS, or MyDeposits)."
    },
    {
      q: "Do I need to be present during the clean?",
      a: "No. You can let the team in and leave, or arrange for key collection from a local estate agent or key lockbox. We will contact you 30 minutes before completion so you can inspect the work or lock up."
    },
    {
      q: "Do you bring your own cleaning supplies and equipment?",
      a: "Yes, our teams arrive fully equipped with commercial-grade chemicals, dip tanks, industrial vacuums, ladders, and steam cleaners. All we require is running hot water and electricity."
    }
  ];

  return (
    <main id="main-content" className="text-start min-h-screen bg-[#F9FCF5]">
      
      {/* 1. SOFTENED TOP PROMO BAR (NO FAKE COUNTDOWN OR FAKE URGENCY) */}
      <div className="bg-[#1F3A00] text-[#DFFBBC] py-2 px-4 w-full flex items-center justify-center gap-3 sm:gap-4 z-[60] relative min-h-[42px] font-sans border-b border-[#3A5C13]/40">
        <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap justify-center text-center">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#B7F56A] text-[#1F3A00] text-[11px] font-bold uppercase tracking-wider">
            Direct Booking Offer
          </span>
          <span className="text-xs sm:text-sm font-normal text-white/95 tracking-tight">
            Save 20% on all property services when booking directly online.
          </span>
          <Link
            href="/booking/"
            className="px-3 py-1 bg-[#B7F56A] text-[#1F3A00] rounded-md text-xs font-inter font-medium hover:opacity-90 transition-opacity duration-150 text-decoration-none whitespace-nowrap cursor-pointer"
          >
            Claim 20% Discount →
          </Link>
        </div>
      </div>

      {/* A/B Test Sticky Header */}
      <div className="bg-white/90 backdrop-blur-md text-[#1F3A00] px-4 py-2.5 sticky top-0 z-50 shadow-2xs border-b border-[#E5FBC9]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-[#1F3A00] text-[#B7F56A] font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Updated Preview
            </span>
            <span className="text-[#1F3A00] font-medium">
              Clean Editorial Hero with Strong Visual Hierarchy & Zero Unverified Numbers
            </span>
          </div>
          <Link
            href="/cleaning-services/end-of-tenancy-cleaning/"
            className="inline-flex items-center gap-1 font-medium text-[#1F3A00] hover:underline"
          >
            <ArrowLeft className="w-3 h-3" />
            Compare with Live Route
          </Link>
        </div>
      </div>

      {/* ===================================================================
          2. CLEAN EDITORIAL HERO SECTION
          =================================================================== */}
      <section className="bg-[#F9FCF5] border-b border-[#E5FBC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#1F3A00]/80 font-medium">
            <Link href="/" className="hover:underline">Home</Link>
            <span aria-hidden="true" className="text-[#1F3A00]/40">/</span>
            <Link href="/cleaning-services/" className="hover:underline">Cleaning Services</Link>
            <span aria-hidden="true" className="text-[#1F3A00]/40">/</span>
            <span className="font-semibold text-[#1F3A00]">End of Tenancy Cleaning</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 grid lg:grid-cols-[1.12fr_0.88fr] gap-12 items-center">
          <div className="space-y-6">
            
            {/* ITEM 2: Single eyebrow badge only */}
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#DCFAB7]/80 border border-[#B7F56A] text-xs font-bold uppercase tracking-wider text-[#1F3A00] w-fit shadow-2xs">
                Cleaning Services · End of Tenancy
              </span>
            </div>

            {/* High-Contrast Editorial Headline */}
            <h1 className="m-0 font-heading text-4xl sm:text-5xl lg:text-[54px] font-semibold leading-[1.08] tracking-tight text-[#1F3A00] max-w-2xl">
              End of tenancy cleaning, guaranteed for full deposit return
            </h1>

            {/* Clear Subtext — template standard: 2–3 sentences, ~40–55 words */}
            <p className="m-0 text-base sm:text-lg leading-relaxed text-[#1F3A00]/90 max-w-xl font-normal">
              Professional end of tenancy cleaning across London for tenants, landlords, and letting agents. Includes our written 48-hour free re-clean guarantee, full agency-approved inventory checklist, and heavy-duty oven degreasing.
            </p>

            {/* ITEM 10: Both CTAs without icon (consistent, no icon on either) */}
            <div className="flex flex-wrap gap-3.5 pt-1">
              <Link 
                href="/booking/" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer shadow-2xs"
              >
                Get Instant Quote
              </Link>
              <Link 
                href="/contact/" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-white border border-[#B7F56A] text-[#1F3A00] hover:opacity-90 transition-opacity duration-200 cursor-pointer"
              >
                Call Us
              </Link>
            </div>

            {/* Trust Checkmarks */}
            <div className="flex flex-wrap gap-x-6 gap-y-2.5 pt-2 text-sm font-medium text-[#1F3A00]">
              <span className="inline-flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#DCFAB7] text-[#1F3A00] flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                48-Hour re-clean guarantee
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#DCFAB7] text-[#1F3A00] flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                Full agency inventory checklist
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#DCFAB7] text-[#1F3A00] flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                Serving all 32 London Boroughs
              </span>
            </div>
          </div>

          {/* ITEM 1: Hero image — plain neutral border, no overlay card, no accent left-border */}
          <div>
            <div 
              role="img"
              aria-label="Professional end of tenancy cleaning team restoring kitchen and oven to move-in standard"
              className="aspect-[4/3] rounded-[22px] overflow-hidden border border-[#D1E8B8] bg-[#EBF4DD] bg-[repeating-linear-gradient(135deg,rgba(31,58,0,0.06)_0_10px,transparent_10px_22px)] flex items-end p-5"
            >
              <span className="font-mono text-xs tracking-wide bg-white/95 border border-[#E5FBC9] rounded-[8px] px-3 py-1.5 text-[#1F3A00] shadow-2xs">
                photo — professional team completing tenancy oven and kitchen deep clean
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. STATS SECTION (Crisp White with Subtle Border)
          =================================================================== */}
      <section className="border-b border-[#E5FBC9] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-6 grid-cols-2 md:grid-cols-4">
          {[
            { value: "£130+", label: "Fixed studio flat starting rate with transparent quotes" },
            { value: "48 Hours", label: "Free re-clean guarantee if clerk flags any issues" },
            { value: "100%", label: "Inventory clerk inspection pass & deposit return focus" },
            { value: "7 Days", label: "Short-notice and weekend bookings across London" }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <span className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                {stat.value}
              </span>
              <span className="text-sm leading-snug text-[#1F3A00]/80">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================
          4. MAIN CONTENT AREA (Left) + STICKY SIDEBAR (Right)
          =================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_330px] gap-12 sm:gap-16 items-start">
          
          <div className="flex flex-col gap-16 min-w-0">
            {/* Overview */}
            <section id="overview" className="scroll-mt-24 flex flex-col gap-5">
              <h2 className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                What professional end of tenancy cleaning involves
              </h2>
              <div className="flex flex-col gap-4 text-base sm:text-lg leading-relaxed text-[#1F3A00]">
                <p className="m-0">
                  Professional end of tenancy cleaning isn&apos;t just a standard vacuum and dust — it is an intensive, top-to-bottom restoration engineered to meet the stringent standards of UK inventory clerks, letting agencies, and deposit protection schemes.
                </p>
                <p className="m-0">
                  Our vetted London teams work methodically through every room using commercial-grade steamers, dip-tank oven degreasers, and descaling chemicals that restore fixtures to their move-in condition. We guarantee the quality in writing with our 48-hour re-clean commitment.
                </p>
              </div>
            </section>

            {/* Room Scope */}
            <section id="signs" className="scroll-mt-24 flex flex-col gap-6">
              <h2 className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                Complete room scope and cleaning inclusions
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {scopeItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white border border-[#E5FBC9] rounded-[18px] p-5 flex flex-col gap-2.5 shadow-2xs">
                      <span className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#B7F56A] text-[#1F3A00]">
                        <Icon className="w-5 h-5 text-[#1F3A00]" />
                      </span>
                      <strong className="text-base font-semibold text-[#1F3A00]">{item.title}</strong>
                      <span className="text-sm leading-relaxed text-[#1F3A00]">
                        {item.desc}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Agency criteria with disclaimer */}
              <div className="grid sm:grid-cols-2 gap-5 items-center p-5 bg-[#DCFAB7]/60 rounded-[20px] border border-[#E5FBC9]">
                <div>
                  <p className="m-0 text-base leading-relaxed text-[#1F3A00]">
                    Our end of tenancy cleaning checklists are engineered to align with standard inventory checkout criteria commonly required across London by major letting agents (such as Foxtons, Savills, and Dexters) and independent ARLA Propertymark inventory clerks.
                  </p>
                  <p className="m-0 pt-2 text-[11px] text-[#1F3A00]/70 italic leading-normal">
                    *Independent professional service. Agent references denote alignment with standard UK inventory benchmarks and do not imply formal endorsement or partnership.
                  </p>
                </div>
                <div 
                  role="img"
                  aria-label="Restored oven door glass and rack after deep clean"
                  className="aspect-[16/10] rounded-md border border-[#1F3A00] bg-[#CFF89D] bg-[repeating-linear-gradient(135deg,rgba(31,58,0,0.12)_0_8px,transparent_8px_18px)] flex items-end p-3.5"
                >
                  <span className="font-mono text-xs bg-[#F9FCF5] border border-[#1F3A00] rounded-[7px] px-2.5 py-1 text-[#1F3A00]">
                    photo — oven door glass and rack restored
                  </span>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faqs" className="scroll-mt-24 flex flex-col gap-5">
              <h2 className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
                Frequently asked questions
              </h2>
              <div className="border border-[#E5FBC9] rounded-[20px] bg-white overflow-hidden divide-y divide-[#E5FBC9] shadow-2xs">
                {tenancyFaqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  const panelId = `faq-panel-${idx}`;
                  const triggerId = `faq-trigger-${idx}`;
                  return (
                    <div key={idx} className="transition-colors duration-150">
                      <button
                        id={triggerId}
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-base sm:text-lg text-[#1F3A00] transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1F3A00]"
                      >
                        <span>{faq.q}</span>
                        <span 
                          aria-hidden="true"
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 bg-[#B7F56A] text-[#1F3A00]" : "text-[#1F3A00]"
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      </button>
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        className={isOpen ? "block px-5 pb-5" : "hidden"}
                      >
                        <p className="m-0 text-sm sm:text-base leading-relaxed text-[#1F3A00]">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Assessment Sidebar — ITEM 8: Title, desc, CTA, Call Us only (no postcode form) */}
          <aside className="lg:sticky lg:top-28 flex flex-col gap-4 bg-white border border-[#E5FBC9] rounded-[22px] p-6 shadow-2xs">
            <p className="m-0 text-xs font-bold uppercase tracking-wider text-[#1F3A00]">
              Book This Service
            </p>
            <h3 className="m-0 font-heading text-2xl font-semibold leading-tight text-[#1F3A00]">
              Guaranteed Handover Clean
            </h3>
            <p className="m-0 text-sm leading-relaxed text-[#1F3A00]">
              Get a fixed quote in 60 seconds with our written 48-hour re-clean guarantee included.
            </p>

            <Link
              href="/booking/"
              className="flex items-center justify-center w-full px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer shadow-2xs"
            >
              Book This Service
            </Link>

            {/* ITEM 9: Plain Call Us — visible border on light bg */}
            <Link
              href="/contact/"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-md font-inter text-base font-medium bg-[#F3F4F6] border border-[#E5E7EB] text-[#1F3A00] hover:bg-[#E5E7EB] transition-colors duration-200 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#1F3A00]" />
              <span>Call Us</span>
            </Link>
          </aside>
        </div>

        {/* ITEM 12: Bottom Callout — Light editorial style, forest green as accent only (not dominant bg) */}
        <section className="mt-16 p-8 sm:p-11 rounded-[26px] bg-white border border-[#E5FBC9] grid md:grid-cols-[1fr_auto] gap-7 items-center relative overflow-hidden">
          {/* Lime accent stripe on left edge */}
          <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B7F56A] rounded-l-[26px]" aria-hidden="true" />
          <div className="space-y-3">
            <h2 className="m-0 font-heading text-3xl sm:text-4xl font-semibold tracking-tight text-[#1F3A00]">
              Ready to secure your full deposit return?
            </h2>
            <p className="m-0 text-base leading-relaxed text-[#1F3A00]/80 max-w-xl font-normal">
              Book your end of tenancy clean in under 2 minutes with our 48-hour re-clean guarantee and agency-approved checklist.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/booking/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 cursor-pointer"
            >
              Book Now — Save 20%
            </Link>
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-white border border-[#B7F56A] text-[#1F3A00] hover:opacity-90 transition-opacity duration-200 cursor-pointer"
            >
              Contact Support
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
