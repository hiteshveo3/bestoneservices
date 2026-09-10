import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allApprovedServicePages, type ApprovedServicePage } from "@/content/approved-service-pages";
import { serviceCatalog, getService, type ServiceCategory } from "@/content/service-catalog";
import { locations } from "@/content/locations";
import { servicePageSchema } from "@/lib/structured-data";
import { generateServiceOfferSchema, generateCostFaqSchema } from "@/lib/service-offer-schema";
import { absoluteUrl } from "@/config/site";
import { MintLimeServiceLayout } from "@/components/service/mint-lime-service-layout";

// A handful of the highest-search-volume locations, used as real internal
// links to that service's location page (instead of the old hardcoded
// Ilford/Barking/Romford links, which pointed at a route that doesn't exist).
const topLocationsByVolume = [...locations]
  .sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))
  .slice(0, 4);

export function generateStaticParams() { 
  return Object.entries(serviceCatalog).flatMap(([category, item]) => item.services.map(([service]) => ({ category, service }))); 
}

function getApprovedOrFallback(category: ServiceCategory, serviceSlug: string, serviceTitle: string): ApprovedServicePage {
  const existing = allApprovedServicePages[`${category}/${serviceSlug}`];
  if (existing) return existing;

  const isCleaning = category === "cleaning-services";
  const isPest = category === "pest-control-services";

  return {
    title: serviceTitle,
    description: `Professional ${serviceTitle} in London for homes, rental properties and businesses. Clear pricing and guaranteed service.`,
    summary: isCleaning
      ? `Complete ${serviceTitle.toLowerCase()} across London delivered by vetted professionals with commercial-grade equipment and 48-hour satisfaction guarantee.`
      : isPest
        ? `Targeted ${serviceTitle.toLowerCase()} for London residential and commercial properties with thorough inspection and certified treatment.`
        : `Specialist ${serviceTitle.toLowerCase()} carried out by insured professionals across Greater London with transparent fixed quotes.`,
    signsTitle: isCleaning ? "Room scope and key priorities" : "Possible signs of activity",
    signs: isCleaning
      ? [
          "High-touch surfaces, kitchens and bathrooms requiring deep descaling and degreasing.",
          "Pre-inspection preparation or post-tenancy handover standards.",
          "Floors, skirting boards, windows and appliances needing commercial detailing."
        ]
      : [
          "Sightings, droppings or evidence in dark or enclosed storage areas.",
          "Unusual noises, scratching or activity noticed during quiet hours.",
          "Damage to food packaging, woodwork, cabling or garden structures."
        ],
    process: [
      ["Share your requirements", "Tell us your property type, size, location, and preferred service date."],
      ["Confirm scope & fixed quote", "We assess the requirements and confirm the full price upfront before booking."],
      ["Professional service execution", "Our experienced team arrives on time with commercial equipment to complete the work."],
      ["Quality guarantee & follow-up", "We ensure full satisfaction with our written guarantee and aftercare support."]
    ],
    price: isCleaning ? "Starting from £90." : isPest ? "Starting from £89." : "Starting from £70.",
    priceFactors: [
      "Property size, room count, and accessible areas.",
      "Severity, condition, or heavy buildup requiring specialist treatments.",
      "Any optional add-ons or multi-room packages requested."
    ],
    prevention: [
      "Follow our technician guidance for maintaining clean and protected spaces.",
      "Ensure regular inspections and address moisture or waste promptly.",
      "Contact our team for periodic maintenance or scheduled preventative visits."
    ],
    faqs: [
      {
        question: `What does professional ${serviceTitle.toLowerCase()} include?`,
        answer: `Our service includes an upfront survey, commercial-grade equipment, tailored treatment or cleaning methodology, and a full satisfaction guarantee.`
      },
      {
        question: `How much does ${serviceTitle.toLowerCase()} cost in London?`,
        answer: `Prices start from standard competitive rates and are confirmed upfront based on your property layout and requirements with zero hidden fees.`
      },
      {
        question: `How quickly can you attend my property?`,
        answer: `We offer same-day, next-day, and weekend appointments across all London boroughs subject to availability.`
      }
    ]
  };
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; service: string }> }): Promise<Metadata> {
  const { category, service } = await params;
  const record = serviceCatalog[category as ServiceCategory] && getService(category as ServiceCategory, service);
  const path = `/${category}/${service}/`;
  const approved = getApprovedOrFallback(category as ServiceCategory, service, record?.[1] ?? "Service");
  return { 
    title: approved.title, 
    description: approved.description, 
    alternates: { canonical: path }, 
    robots: { index: true, follow: true } 
  };
}

export default async function ServicePage({ params }: { params: Promise<{ category: string; service: string }> }) {
  const { category, service } = await params;
  if (!(category in serviceCatalog)) notFound();
  const serviceRecord = getService(category as ServiceCategory, service);
  if (!serviceRecord) notFound();
  const [, title] = serviceRecord;
  const path = `/${category}/${service}/`;
  const approved = getApprovedOrFallback(category as ServiceCategory, service, title);

  const pageUrl = absoluteUrl(path);
  const schema = servicePageSchema({
    name: approved.title,
    description: approved.description,
    path,
    faqs: approved.faqs,
    areaServed: "London",
    breadcrumbParent: { name: serviceCatalog[category as ServiceCategory].label, path: `/${category}/` },
    offers: generateServiceOfferSchema(service, pageUrl),
    extraFaqs: generateCostFaqSchema(service, approved.title),
  });

  return (
    <main id="main-content" className="text-start">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <MintLimeServiceLayout
        category={category}
        service={service}
        categoryLabel={serviceCatalog[category as ServiceCategory].label}
        approved={approved}
        nearbyLocations={topLocationsByVolume}
      />
    </main>
  );
}
