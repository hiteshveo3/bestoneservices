import { absoluteUrl, siteConfig } from "@/config/site";
import type { ServiceFaq } from "@/content/service-types";

export function organisationSchema() {
  return {
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    image: `${siteConfig.url}/images/hero-property-services-green-v1.png`,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    ...(siteConfig.phoneEnabled ? { telephone: siteConfig.phone } : {}),
    // Star-rating rich snippet eligibility. This data is already collected
    // in siteConfig — it just wasn't wired into any schema before.
    ...(siteConfig.googleReviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: siteConfig.googleRating,
            reviewCount: siteConfig.googleReviewCount,
            bestRating: "5",
          },
        }
      : {}),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: "en-GB",
  };
}

/**
 * The booking flow is identical in substance across every service — describe,
 * confirm price, attend, guarantee — so one HowTo covers all of them rather
 * than hand-writing near-duplicate steps per page.
 */
export function bookingHowToSchema(serviceName: string, url: string) {
  return {
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name: `How to book ${serviceName} in London`,
    step: [
      { "@type": "HowToStep", position: 1, name: "Share your requirements", text: "Tell us your property type, size, location and preferred date." },
      { "@type": "HowToStep", position: 2, name: "Confirm the fixed price", text: "We confirm the exact price in writing before anything is booked — no inspection-only quotes." },
      { "@type": "HowToStep", position: 3, name: "Team attends and completes the work", text: "Our vetted, insured team arrives in the confirmed window with the right equipment." },
      { "@type": "HowToStep", position: 4, name: "Guarantee applies automatically", text: "The relevant written guarantee (48-hour re-clean, or 1–3 month pest warranty) covers the work with no extra cost." },
    ],
  };
}

export function servicePageSchema({
  name,
  description,
  path,
  faqs,
  areaServed,
  breadcrumbParent,
  offers,
  extraFaqs,
}: {
  name: string;
  description: string;
  path: string;
  faqs: readonly ServiceFaq[];
  areaServed?: string;
  breadcrumbParent?: { name: string; path: string };
  /** Product/Offer or AggregateOffer nodes from service-offer-schema.ts, sourced from pricing-data.ts. */
  offers?: object[];
  /** Natural-language cost Q&A from generateCostFaqSchema, appended after the page's own FAQs. */
  extraFaqs?: { question: string; answer: string }[];
}) {
  const url = absoluteUrl(path);
  const allFaqs = [...faqs, ...(extraFaqs ?? [])];

  return {
    "@context": "https://schema.org",
    "@graph": [
      organisationSchema(),
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: "en-GB",
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        serviceType: name,
        description,
        provider: { "@id": `${siteConfig.url}/#organization` },
        url,
        ...(areaServed ? { areaServed } : {}),
      },
      ...(offers ?? []),
      bookingHowToSchema(name, url),
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.url,
          },
          ...(breadcrumbParent ? [{
            "@type": "ListItem",
            position: 2,
            name: breadcrumbParent.name,
            item: absoluteUrl(breadcrumbParent.path),
          }] : []),
          {
            "@type": "ListItem",
            position: breadcrumbParent ? 3 : 2,
            name,
            item: url,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: allFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}
