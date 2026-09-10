import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Award, MapPin, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { HeroAbout } from "@/components/hero";
import { SectionReveal, StaggerGrid, StaggerItem } from "@/components/motion";
import { SitewideIllustrationGrid } from "@/components/illustrations/sitewide-illustration-grid";


export const metadata: Metadata = { 
  title: "About Us | Professional Property Services",
  description: "Learn about Best One Services Ltd - your trusted multi-service property engine across London for Cleaning, Pest Control, Gardening, and Removals.", 
  alternates: { canonical: "/about/" } 
};

export default function AboutPage() { 
  return (
    <main id="main-content" className="space-y-16 text-start">
      
      {/* 1. REFINED EDITORIAL ABOUT HERO */}
      <HeroAbout />

      {/* 2. TRUST & CREDENTIALS GRID (White Cards on Canvas) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.06}>
          <StaggerItem className="bg-[#F9FCF5] rounded-[24px] p-6 sm:p-8 border border-[#B7F56A] shadow-2xs hover:border-[#1F3A00] transition-colors duration-200 space-y-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#DCFAB7] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#1F3A00]" />
            </div>
            <h3 className="font-heading text-xl font-medium text-ink-900">Fully Licensed & Insured</h3>
            <p className="text-base text-ink-500 leading-relaxed">
              Full public liability and goods-in-transit insurance coverage across all service operations.
            </p>
          </StaggerItem>

          <StaggerItem className="bg-[#F9FCF5] rounded-[24px] p-6 sm:p-8 border border-[#B7F56A] shadow-2xs hover:border-[#1F3A00] transition-colors duration-200 space-y-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#DCFAB7] flex items-center justify-center">
              <Award className="w-6 h-6 text-[#1F3A00]" />
            </div>
            <h3 className="font-heading text-xl font-medium text-ink-900">48-Hour Re-Clean Guarantee</h3>
            <p className="text-base text-ink-500 leading-relaxed">
              Detailed checkout checklists backed by a complimentary 48-hour re-clean commitment.
            </p>
          </StaggerItem>

          <StaggerItem className="bg-[#F9FCF5] rounded-[24px] p-6 sm:p-8 border border-[#B7F56A] shadow-2xs hover:border-[#1F3A00] transition-colors duration-200 space-y-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#DCFAB7] flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#1F3A00]" />
            </div>
            <h3 className="font-heading text-xl font-medium text-ink-900">Greater London Coverage</h3>
            <p className="text-base text-ink-500 leading-relaxed">
              Operating out of Ilford across all M25 postcodes and surrounding communities.
            </p>
          </StaggerItem>

          <StaggerItem className="bg-[#F9FCF5] rounded-[24px] p-6 sm:p-8 border border-[#B7F56A] shadow-2xs hover:border-[#1F3A00] transition-colors duration-200 space-y-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#DCFAB7] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#1F3A00]" />
            </div>
            <h3 className="font-heading text-xl font-medium text-ink-900">Deterministic Pricing</h3>
            <p className="text-base text-ink-500 leading-relaxed">
              Zero hidden fees or surcharges. All prices are calculated algorithmically upfront.
            </p>
          </StaggerItem>
        </StaggerGrid>
      </section>

      <SitewideIllustrationGrid
        eyebrow="Responsible property care"
        title="Practical support for people and properties"
        cards={[
          { slug: "eco-friendly-care", title: "Considered Product Choices", description: "We match equipment and products to the property, surface and confirmed service scope." },
          { slug: "landlord-tenant-support", title: "Landlord & Tenant Support", description: "Clear communication helps everyone understand access, timing and handover expectations." },
          { slug: "service-guarantee", title: "Confident Property Handover", description: "Clear completion standards and practical after-service support provide a dependable handover.", imageSrc: "/images/feature-service-guarantee-blue-v1.png", imageAlt: "Satisfied customer receiving property keys with service guarantee cards" },
        ]}
      />

      {/* 3. REGISTERED OFFICE & COMPANY DETAILS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal className="bg-[#F9FCF5] rounded-[24px] p-8 sm:p-12 border border-[#B7F56A] shadow-2xs space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-[#DCFAB7] text-[#1F3A00] text-xs font-mono font-semibold uppercase tracking-wider">
            REGISTERED COMPANY INFORMATION
          </span>
          <h2 className="font-heading text-3xl font-medium text-ink-900">{siteConfig.name} Ltd</h2>
          <p className="text-base text-ink-500 max-w-2xl leading-relaxed">
            Registered in England & Wales (Company No. 15574809). <br />
            Registered Address: {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion} {siteConfig.address.postalCode}.
          </p>
        </SectionReveal>
      </section>

      {/* 4. FINAL BRAND CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <SectionReveal className="brand-cta-section p-8 sm:p-14 text-center space-y-6 relative overflow-hidden rounded-[28px] border border-[#3A5C13]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DCFAB7] text-[#1F3A00] text-sm font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#1F3A00]" />
            <span>LET&apos;S CARE FOR YOUR PROPERTY</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight max-w-3xl mx-auto text-[#F9FCF5]">
            Have Questions or Need a Custom Quote?
          </h2>

          <p className="text-lg text-[#DFFBBC] max-w-xl mx-auto font-normal">
            Our team is ready to discuss your property requirements and confirm your service details.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/contact/" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 text-decoration-none w-full sm:w-auto gap-2 cursor-pointer"
            >
              <span>Contact Support Team</span>
              <ArrowRight className="w-5 h-5 text-[#1F3A00]" />
            </Link>
          </div>
        </SectionReveal>
      </section>
    </main>
  );
}
