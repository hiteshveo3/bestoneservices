import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Sparkles, ArrowRight } from "lucide-react";
import { SitewideIllustrationGrid } from "@/components/illustrations/sitewide-illustration-grid";
import { siteContact } from "@/config/site-contact";

export const metadata: Metadata = { 
  title: "Coverage Areas Across Greater London",
  description: "Explore operational service coverage across London for End of Tenancy Cleaning, Pest Control, Gardening, and Removals.", 
  alternates: { canonical: "/areas/" } 
};

export default function AreasPage() {
  const primaryAreas = [
    { name: "Ilford & Redbridge", code: "IG1 - IG8", desc: "Full 4-vertical coverage including same-day emergency pest control and tenancy cleaning." },
    { name: "Barking & Dagenham", code: "RM8 - RM10", desc: "Complete cleaning, gardening clearance, rodent treatment, and man & van removals." },
    { name: "Stratford & Newham", code: "E15 - E20", desc: "Specialized apartment tenancy cleans, carpet steam extraction, and bed bug treatments." },
    { name: "Romford & Havering", code: "RM1 - RM7", desc: "Residential 2-gardener maintenance, villa/house cleaning, and full removals packaging." },
    { name: "Walthamstow & Forest", code: "E17", desc: "End of tenancy move-out cleaning, pest clearance packages, and garden waste removal." },
    { name: "Greater London M25", code: "All M25 Postcodes", desc: "London-wide operational service coverage subject to scheduling and team availability." },
  ];

  return (
    <main id="main-content" className="space-y-16 py-10 text-start">
      
      {/* 1. CANVASISED PAGE HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="space-y-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DCFAB7] text-[#1F3A00] text-xs font-mono font-semibold uppercase border border-[#E5FBC9]">
            <MapPin className="w-4 h-4 text-[#1F3A00]" />
            <span>OPERATIONAL SERVICE COVERAGE</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-medium text-ink-900 tracking-tight leading-tight">
            London Service Coverage, Checked For Each Request.
          </h1>

          <p className="text-lg sm:text-xl text-ink-500 max-w-2xl mx-auto font-normal leading-relaxed">
            Best One Services supports Cleaning, Pest Control, Gardening, and Removals across Greater London and M25 surrounding postcodes.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <Link
              href={siteContact.getWhatsappUrl("Hi, I'd like to check postcode availability with Best One Services.")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 flex items-center gap-2 text-decoration-none"
            >
              <span>Check Postcode Availability</span>
              <ArrowRight className="w-5 h-5 text-[#1F3A00]" />
            </Link>
          </div>
        </div>
      </section>

      <SitewideIllustrationGrid
        eyebrow="London operations"
        title="Local coverage with a responsive service network"
        cards={[
          { slug: "london-coverage", title: "Greater London Coverage", description: "Postcode availability is checked against the service, team and requested timing.", href: siteContact.getWhatsappUrl("Hi, I'd like to check service availability for my postcode with Best One Services."), imageSrc: "/images/feature-london-coverage-blue-v1.png", imageAlt: "London service professional with coverage map and service van cards" },
          { slug: "emergency-response", title: "Urgent Response Coordination", description: "Share the issue and property access details so the quickest suitable response can be reviewed.", href: "/contact/" },
        ]}
      />

      {/* 2. COVERAGE AREAS CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <h2 className="font-heading text-3xl font-medium text-ink-900">Primary London Hubs & Regions</h2>
          <p className="text-base text-ink-500">Contact us with your postcode and service required for immediate confirmation.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {primaryAreas.map((area, idx) => (
            <div key={idx} className="bg-[#F9FCF5] rounded-[24px] p-6 sm:p-8 border border-[#B7F56A] shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-heading text-xl font-medium text-ink-900">{area.name}</h3>
                  <span className="px-3 py-1 rounded-full bg-[#F9FCF5] text-ink-700 text-xs font-mono font-medium border border-[#E5FBC9]">
                    {area.code}
                  </span>
                </div>
                <p className="text-base text-ink-500 leading-relaxed">
                  {area.desc}
                </p>
              </div>

              <Link
                href={siteContact.getWhatsappUrl(`Hi, I'd like to book a service in ${area.name.split("&")[0].trim()} with Best One Services.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2.5 rounded-md font-inter text-sm font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 text-center text-decoration-none block"
              >
                Book In {area.name.split("&")[0]}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FINAL BRAND CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="brand-cta-section p-8 sm:p-14 text-center space-y-6 relative overflow-hidden rounded-[28px] border border-[#3A5C13]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DCFAB7] text-[#1F3A00] text-base font-mono font-medium uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#1F3A00]" />
            <span>CONFIRM POSTCODE AVAILABILITY</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight max-w-3xl mx-auto text-[#F9FCF5]">
            Need Service In Your London Postcode?
          </h2>

          <p className="text-lg text-[#DFFBBC] max-w-xl mx-auto font-normal">
            Enter your property details and preferred timing to receive an instant price estimate.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={siteContact.getWhatsappUrl("Hi, I'd like an instant quote from Best One Services.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 text-decoration-none w-full sm:w-auto gap-2 cursor-pointer"
            >
              <span>Get Instant Quote</span>
              <ArrowRight className="w-5 h-5 text-[#1F3A00]" />
            </Link>
            <Link 
              href="/contact/" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-white border border-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 text-decoration-none w-full sm:w-auto cursor-pointer"
            >
              Contact Support Team
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

