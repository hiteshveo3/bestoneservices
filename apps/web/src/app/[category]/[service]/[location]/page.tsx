import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serviceCatalog, type ServiceCategory } from "@/content/service-catalog";
import { locations } from "@/content/locations";
import { getServiceLocationContent } from "@/content/service-location-content";
import { servicePageSchema } from "@/lib/structured-data";
import { generateServiceOfferSchema, generateCostFaqSchema } from "@/lib/service-offer-schema";
import { absoluteUrl } from "@/config/site";
import { MintLimeServiceLayout } from "@/components/service/mint-lime-service-layout";

const VALID_CATEGORIES: ServiceCategory[] = ["pest-control-services", "cleaning-services"];

export function generateStaticParams() {
  return VALID_CATEGORIES.flatMap((category) =>
    serviceCatalog[category].services.flatMap(([service]) =>
      locations.map((location) => ({ category, service, location: location.slug }))
    )
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; service: string; location: string }>;
}): Promise<Metadata> {
  const { category, service, location } = await params;
  if (!VALID_CATEGORIES.includes(category as ServiceCategory)) return { robots: { index: false, follow: false } };
  const content = getServiceLocationContent(category as ServiceCategory, service, location);
  const path = `/${category}/${service}/${location}/`;
  if (!content) return { robots: { index: false, follow: false } };
  return {
    title: `${content.title} in ${content.locationName} | London`,
    description: content.description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
  };
}

export default async function ServiceLocationPage({
  params,
}: {
  params: Promise<{ category: string; service: string; location: string }>;
}) {
  const { category, service, location } = await params;
  if (!VALID_CATEGORIES.includes(category as ServiceCategory)) notFound();
  const content = getServiceLocationContent(category as ServiceCategory, service, location);
  if (!content) notFound();

  const path = `/${category}/${service}/${location}/`;
  const pageUrl = absoluteUrl(path);
  const schema = servicePageSchema({
    name: `${content.title} in ${content.locationName}`,
    description: content.description,
    path,
    faqs: content.faqs,
    areaServed: content.locationName,
    breadcrumbParent: { name: serviceCatalog[category as ServiceCategory].label, path: `/${category}/${service}/` },
    offers: generateServiceOfferSchema(service, pageUrl),
    extraFaqs: generateCostFaqSchema(service, `${content.title} in ${content.locationName}`),
  });

  return (
    <main id="main-content" className="text-start">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <MintLimeServiceLayout 
        category={category}
        service={service}
        categoryLabel={serviceCatalog[category as ServiceCategory].label}
        approved={content}
        locationName={content.locationName}
        locationIntro={content.locationIntro}
        localDemandNote={content.localDemandNote}
        nearbyLocations={content.nearbyLocations}
      />
    </main>
  );
}
