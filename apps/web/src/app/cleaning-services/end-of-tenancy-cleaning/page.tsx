import type { Metadata } from "next";
import { MintLimeServiceLayout } from "@/components/service/mint-lime-service-layout";
import { InstantEstimator } from "@/components/ui/calculator";
import { approvedServicePages } from "@/content/approved-service-pages";
import { servicePageSchema } from "@/lib/structured-data";
import { generateServiceOfferSchema, generateCostFaqSchema } from "@/lib/service-offer-schema";
import { absoluteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "End of Tenancy Cleaning London | From £130",
  description: "Professional End of Tenancy Cleaning across Greater London from £130. Flat-rate pricing based on property size, backed by our 48-Hour Re-Clean Guarantee.",
  alternates: { canonical: "/cleaning-services/end-of-tenancy-cleaning/" },
  openGraph: {
    title: "End of Tenancy Cleaning London | From £130 | Best One Services",
    description: "Professional End of Tenancy Cleaning across Greater London from £130. Flat-rate pricing based on property size, backed by our 48-Hour Re-Clean Guarantee.",
    url: "https://www.bestoneservices.co.uk/cleaning-services/end-of-tenancy-cleaning/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "End of Tenancy Cleaning London | From £130 | Best One Services",
    description: "Professional End of Tenancy Cleaning across Greater London from £130. Flat-rate pricing based on property size, backed by our 48-Hour Re-Clean Guarantee.",
  },
};

export default function EndOfTenancyCleaningPage() {
  const approved = approvedServicePages["cleaning-services/end-of-tenancy-cleaning"];
  const path = "/cleaning-services/end-of-tenancy-cleaning/";
  const pageUrl = absoluteUrl(path);
  const schema = servicePageSchema({
    name: "End of Tenancy Cleaning London",
    description: "Professional End of Tenancy Cleaning across Greater London from £130 with 48-Hour Re-Clean Guarantee.",
    path,
    faqs: approved.faqs,
    areaServed: "London",
    breadcrumbParent: { name: "Cleaning Services", path: "/cleaning-services/" },
    offers: generateServiceOfferSchema("end-of-tenancy-cleaning", pageUrl),
    extraFaqs: generateCostFaqSchema("end-of-tenancy-cleaning", "End of Tenancy Cleaning"),
  });

  return (
    <main id="main-content" className="text-start">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <MintLimeServiceLayout
        category="cleaning-services"
        service="end-of-tenancy-cleaning"
        categoryLabel="Cleaning Services"
        approved={approved}
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <InstantEstimator defaultVertical="cleaning" />
      </section>
    </main>
  );
}
