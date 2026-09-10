import { absoluteUrl, siteConfig } from "@/config/site";
import { masterPricingData } from "@/config/pricing-data";
import { PRICING_FAQS } from "@/config/pricing-faqs";

export function generatePricingPageSchema() {
  const pageUrl = absoluteUrl("/prices/");

  const priceValidUntil = new Date();
  priceValidUntil.setMonth(priceValidUntil.getMonth() + 3);
  const priceValidUntilStr = priceValidUntil.toISOString().slice(0, 10);

  const serviceSchemas = Object.values(masterPricingData).map((cat) => ({
    "@type": "Service",
    "@id": `${pageUrl}#service-${cat.id}`,
    name: cat.title,
    serviceType: cat.title,
    description: cat.description,
    provider: { "@id": `${siteConfig.url}/#organization` },
    offers: cat.variants.map((v) =>
      v.maxPrice
        ? {
            "@type": "AggregateOffer",
            name: v.name,
            description: `${v.name} - ${v.features.join(", ")}`,
            lowPrice: v.startingPrice,
            highPrice: v.maxPrice,
            priceCurrency: "GBP",
            priceValidUntil: priceValidUntilStr,
            availability: "https://schema.org/InStock",
            url: pageUrl,
          }
        : {
            "@type": "Offer",
            name: v.name,
            description: `${v.name} - ${v.features.join(", ")}`,
            priceCurrency: "GBP",
            price: v.startingPrice,
            priceValidUntil: priceValidUntilStr,
            availability: "https://schema.org/InStock",
            url: pageUrl,
          }
    ),
  }));

  const pricingFaqs = PRICING_FAQS;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Clear Pricing & Service Estimator | Best One Services",
        description: "Transparent, deterministic pricing for End of Tenancy Cleaning, Pest Control, Gardening, and Removals across Greater London.",
        inLanguage: "en-GB",
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      ...serviceSchemas,
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Prices & Estimator", item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: pricingFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
}
