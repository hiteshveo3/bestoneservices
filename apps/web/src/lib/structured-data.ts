import { absoluteUrl, siteConfig } from "@/config/site";
import type { ServiceFaq } from "@/content/service-types";

export function organisationSchema() {
  return {
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    ...(siteConfig.phoneEnabled ? { telephone: siteConfig.phone } : {}),
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

export function servicePageSchema({
  name,
  description,
  path,
  faqs,
  areaServed,
  breadcrumbParent,
}: {
  name: string;
  description: string;
  path: string;
  faqs: readonly ServiceFaq[];
  areaServed?: string;
  breadcrumbParent?: { name: string; path: string };
}) {
  const url = absoluteUrl(path);

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
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}
