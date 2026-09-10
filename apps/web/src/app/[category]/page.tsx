import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AnimatedIllustration } from "@/components/illustrations/animated-illustration";
import { serviceCatalog, type ServiceCategory } from "@/content/service-catalog";
import { InstantEstimator } from "@/components/ui/calculator";
import { siteContact } from "@/config/site-contact";

export function generateStaticParams() {
  return Object.keys(serviceCatalog).map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const item = serviceCatalog[category as ServiceCategory];
  return {
    title: item?.label ?? "Services",
    description: item?.intro,
    alternates: { canonical: `/${category}/` },
  };
}

export default async function ServiceCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const item = serviceCatalog[category as ServiceCategory];
  if (!item) notFound();

  return (
    <main id="main-content" className="min-h-screen bg-[#F9FCF5] text-start">
      {/* Category Hero */}
      <section className="py-14 sm:py-20 border-b border-[#E5FBC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="px-3.5 py-1 rounded-full bg-[#DCFAB7] text-[#1F3A00] text-xs font-mono font-bold uppercase tracking-wider">
            Best One Services
          </span>
          <h1 className="mt-4 font-heading text-4xl sm:text-5xl font-semibold tracking-tight text-[#1F3A00]">
            {item.label}
          </h1>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-[#1F3A00] leading-relaxed">
            {item.intro}
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {item.services.map(([slug, label], index) => (
              <Link
                href={`/${category}/${slug}/`}
                key={slug}
                className="group block rounded-[24px] border border-[#B7F56A] bg-[#F9FCF5] p-4 shadow-2xs hover:border-[#1F3A00] transition-colors duration-200 text-decoration-none focus:outline-none"
              >
                <div className="relative aspect-[3/2] overflow-hidden rounded-[18px] bg-[#F9FCF5] border border-[#E5FBC9]">
                  <AnimatedIllustration
                    slug={slug}
                    alt={`${label} service illustration`}
                    priority={index < 3}
                  />
                </div>
                <div className="space-y-2 px-2 pb-2 pt-5">
                  <h2 className="font-heading text-xl font-bold text-[#1F3A00] group-hover:text-[#2d5004] transition-colors duration-150">
                    {label}
                  </h2>
                  <p className="text-sm leading-relaxed text-[#1F3A00]">
                    Detailed service scope, pricing breakdown, preparation guidance and instant online booking.
                  </p>
                  <span className="inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-[#1F3A00]">
                    <span>Explore service</span>
                    <ArrowRight className="w-4 h-4 text-[#1F3A00]" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Instant Calculator — embedded inline for the pest-control vertical
          (cleaning already carries its own dedicated flagship page embed). */}
      {category === "pest-control-services" && (
        <section className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InstantEstimator defaultVertical="pest" />
        </section>
      )}

      {/* Brand Assistance Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-[26px] bg-[#1F3A00] text-[#DFFBBC] flex flex-col md:flex-row items-center justify-between gap-6 border border-[#3A5C13]">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[#F9FCF5]">
              Need help choosing the right service?
            </h2>
            <p className="text-base text-[#DFFBBC]">
              Speak directly with our London operations team. We confirm the scope, availability and a fixed transparent quote before any commitment.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href={siteContact.getWhatsappUrl("Hi, I'd like to book a service with Best One Services.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-[#B7F56A] text-[#1F3A00] border-none hover:opacity-90 transition-opacity duration-200 text-decoration-none cursor-pointer"
            >
              Book a Service
            </Link>
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md font-inter text-base font-medium bg-transparent text-[#F9FCF5] border border-[#3A5C13] hover:opacity-90 transition-opacity duration-200 text-decoration-none cursor-pointer"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
