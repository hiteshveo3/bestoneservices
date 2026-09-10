import { absoluteUrl, siteConfig } from "@/config/site";
import { masterPricingData } from "@/config/pricing-data";

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

  const pricingFaqs = [
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
